import { StateEffect, StateField, Extension } from '@codemirror/state';
import { EditorView, Decoration, DecorationSet } from '@codemirror/view';
import { AnalysisResult } from './types';

export interface DecoratePayload {
  result: AnalysisResult;
}

export const setUnslopFindings = StateEffect.define<DecoratePayload>();
export const clearUnslopFindings = StateEffect.define<void>();

const unslopField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },

  update(deco, tr) {
    deco = deco.map(tr.changes);

    for (const effect of tr.effects) {
      if (effect.is(clearUnslopFindings)) {
        return Decoration.none;
      }
      if (effect.is(setUnslopFindings)) {
        const { result } = effect.value;
        const marks = result.findings
          .map(f =>
            Decoration.mark({
              class: `unslop-mark unslop-${f.categoryId}`,
              attributes: {
                'title': `${f.categoryLabel}${f.suggestion ? ': ' + f.suggestion : ''}`,
                'data-unslop-category': f.categoryId,
              },
            }).range(f.from + result.offset, f.to + result.offset)
          )
          // DecorationSet requires sorted, non-overlapping ranges
          .sort((a, b) => a.from - b.from || a.to - b.to);

        // Build the set, skipping overlapping ranges to avoid CM6 errors
        const filtered: typeof marks = [];
        let lastTo = -1;
        for (const mark of marks) {
          if (mark.from >= lastTo) {
            filtered.push(mark);
            lastTo = mark.to;
          }
        }

        return Decoration.set(filtered);
      }
    }
    return deco;
  },

  provide: f => EditorView.decorations.from(f as any),
});

export function buildUnslopExtension(): Extension {
  return [unslopField];
}
