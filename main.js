var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => UnslopPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/types.ts
var CATEGORY_IDS = {
  CLICHES: "cliches",
  FILLER: "filler",
  PASSIVE: "passive",
  JARGON: "jargon",
  MONOTONY: "monotony",
  ENTHUSIASM: "enthusiasm",
  ADVERBS: "adverbs",
  LISTS: "lists"
};
var CATEGORY_IDS_WITH_CUSTOM = { ...CATEGORY_IDS, CUSTOM: "custom" };
var CATEGORY_LABELS = {
  cliches: "AI Clich\xE9s",
  filler: "Filler & Hedging",
  passive: "Passive Voice",
  jargon: "Corporate Jargon",
  monotony: "Sentence Monotony",
  enthusiasm: "Fake Enthusiasm",
  adverbs: "Adverb Overuse",
  lists: "List Addiction",
  custom: "Custom Rules"
};
var CATEGORY_COLORS = {
  cliches: "#e07b7b",
  filler: "#e0a87b",
  passive: "#d4c94a",
  jargon: "#7bc8e0",
  monotony: "#a07be0",
  enthusiasm: "#e07bb8",
  adverbs: "#7be0a0",
  lists: "#7b9ae0",
  custom: "#b07be0"
};

// src/rules/cliches.ts
var CLICHES = [
  { phrase: "delve into", suggestion: '"explore" or "examine"' },
  { phrase: "delve", suggestion: '"explore" or "examine"' },
  { phrase: "tapestry", suggestion: "Be specific \u2014 what is the actual relationship or mix?" },
  { phrase: "nuanced", suggestion: "Describe what the nuance actually is" },
  { phrase: "multifaceted", suggestion: '"complex" or list the specific aspects' },
  { phrase: "in the realm of", suggestion: '"in" or "within"' },
  { phrase: "stands as a testament", suggestion: '"shows" or "demonstrates"' },
  { phrase: "testament to", suggestion: '"proof of" or "evidence of"' },
  { phrase: "it is what it is", suggestion: "Cut it \u2014 say what you actually mean" },
  { phrase: "at the end of the day", suggestion: "Cut it \u2014 state your conclusion directly" },
  { phrase: "game changer", suggestion: '"significant shift" or be specific about what changed' },
  { phrase: "game-changer", suggestion: '"significant shift" or be specific about what changed' },
  { phrase: "paradigm shift", suggestion: "Describe what actually changed and how" },
  { phrase: "cutting-edge", suggestion: '"new," "recent," or name the specific technology' },
  { phrase: "cutting edge", suggestion: '"new," "recent," or name the specific technology' },
  { phrase: "ever-evolving", suggestion: '"changing" \u2014 or just name the change' },
  { phrase: "ever evolving", suggestion: '"changing" \u2014 or just name the change' },
  { phrase: "in today's world", suggestion: "Cut it \u2014 be specific about context" },
  { phrase: "in today's fast-paced world", suggestion: "Cut the whole phrase" },
  { phrase: "shed light on", suggestion: '"explain" or "clarify"' },
  { phrase: "foster", suggestion: '"encourage," "build," or "support"' },
  { phrase: "comprehensive", suggestion: "Be specific about what is covered" },
  { phrase: "robust", suggestion: '"strong," "reliable," or describe specifically' },
  { phrase: "holistic", suggestion: "Describe what you're including and why" },
  { phrase: "ecosystem", suggestion: 'Be specific: "community," "tooling," "market," etc.' },
  { phrase: "landscape", suggestion: 'Be specific: "market," "field," "space," etc.' },
  { phrase: "unlock", suggestion: '"enable" or "allow"' },
  { phrase: "dive deep", suggestion: '"examine closely" or "analyse in detail"' },
  { phrase: "dive into", suggestion: '"examine" or "explore"' },
  { phrase: "embark on", suggestion: '"start" or "begin"' },
  { phrase: "journey", suggestion: "Be concrete about the actual process or change" },
  { phrase: "transformative", suggestion: "Describe what specifically changed" },
  { phrase: "seamless", suggestion: "Describe why it works smoothly, or cut it" },
  { phrase: "innovative", suggestion: "Describe what is actually new about it" },
  { phrase: "synergy", suggestion: "Describe how the parts actually work together" }
];
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function detectCliches(text) {
  const findings = [];
  for (const { phrase, suggestion } of CLICHES) {
    const re = new RegExp(`\\b${escapeRegex(phrase)}\\b`, "gi");
    let m;
    while ((m = re.exec(text)) !== null) {
      findings.push({
        categoryId: CATEGORY_IDS.CLICHES,
        categoryLabel: "AI Clich\xE9s",
        text: m[0],
        from: m.index,
        to: m.index + m[0].length,
        suggestion
      });
    }
  }
  return findings;
}

// src/rules/filler.ts
var FILLERS = [
  { phrase: "arguably", suggestion: "Make the argument or cut it" },
  { phrase: "essentially", suggestion: "Cut it, or say exactly what you mean" },
  { phrase: "it goes without saying", suggestion: "If it goes without saying, don't say it" },
  { phrase: "for what it's worth", suggestion: "Cut it \u2014 just say the thing" },
  { phrase: "needless to say", suggestion: "Then don't say it, or cut the phrase" },
  { phrase: "as a matter of fact", suggestion: "Cut it \u2014 just state the fact" },
  { phrase: "basically", suggestion: "Cut it or be more precise" },
  { phrase: "to be honest", suggestion: "Cut it \u2014 implies you're not always honest" },
  { phrase: "if you will", suggestion: "Cut it" },
  { phrase: "so to speak", suggestion: "Cut it, or commit to the metaphor" },
  { phrase: "as it were", suggestion: "Cut it" },
  { phrase: "in a sense", suggestion: "Specify which sense, or cut it" },
  { phrase: "in some ways", suggestion: "Specify which ways, or cut it" },
  { phrase: "sort of", suggestion: "Cut it or be more precise" },
  { phrase: "kind of", suggestion: "Cut it or be more precise" },
  { phrase: "per se", suggestion: "Cut it \u2014 usually filler" },
  { phrase: "in terms of", suggestion: 'Rewrite: "regarding X" or just name it directly' },
  { phrase: "the fact that", suggestion: 'Rewrite: "that X" or restructure the sentence' },
  { phrase: "due to the fact that", suggestion: '"because"' },
  { phrase: "in order to", suggestion: '"to"' },
  { phrase: "it is important to note", suggestion: "Cut it \u2014 just make the point" },
  { phrase: "it should be noted", suggestion: "Cut it \u2014 just state the thing" },
  { phrase: "it is worth noting", suggestion: "Cut it \u2014 just state the thing" },
  { phrase: "needless to mention", suggestion: "Cut the phrase and mention it directly" },
  { phrase: "without further ado", suggestion: "Cut it \u2014 just start" }
];
function escapeRegex2(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function detectFiller(text) {
  const findings = [];
  for (const { phrase, suggestion } of FILLERS) {
    const re = new RegExp(`\\b${escapeRegex2(phrase)}\\b`, "gi");
    let m;
    while ((m = re.exec(text)) !== null) {
      findings.push({
        categoryId: CATEGORY_IDS.FILLER,
        categoryLabel: "Filler & Hedging",
        text: m[0],
        from: m.index,
        to: m.index + m[0].length,
        suggestion
      });
    }
  }
  return findings;
}

// src/rules/passive-voice.ts
var IRREGULAR_PP = [
  "built",
  "bought",
  "brought",
  "caught",
  "done",
  "driven",
  "eaten",
  "fallen",
  "felt",
  "found",
  "given",
  "gone",
  "grown",
  "heard",
  "held",
  "kept",
  "known",
  "left",
  "made",
  "meant",
  "paid",
  "put",
  "read",
  "run",
  "said",
  "seen",
  "sent",
  "shown",
  "spoken",
  "taken",
  "told",
  "thought",
  "understood",
  "worn",
  "written",
  "broken",
  "chosen",
  "drawn",
  "drunk",
  "flown",
  "forgotten",
  "frozen",
  "hidden",
  "lain",
  "proven",
  "risen",
  "stolen",
  "thrown",
  "woken",
  "withdrawn"
].join("|");
var PASSIVE_RE = new RegExp(
  `\\b(am|is|are|was|were|be|been|being)\\b(?:\\s+\\w+ly)?\\s+(?:\\w+ed\\b|(?:${IRREGULAR_PP})\\b)`,
  "gi"
);
function detectPassiveVoice(text) {
  const findings = [];
  let m;
  PASSIVE_RE.lastIndex = 0;
  while ((m = PASSIVE_RE.exec(text)) !== null) {
    findings.push({
      categoryId: CATEGORY_IDS.PASSIVE,
      categoryLabel: "Passive Voice",
      text: m[0],
      from: m.index,
      to: m.index + m[0].length,
      suggestion: "Rewrite to name who or what does the action"
    });
  }
  return findings;
}

// src/rules/corporate-jargon.ts
var JARGON = [
  { phrase: "leverage", suggestion: '"use"' },
  { phrase: "bandwidth", suggestion: '"time," "capacity," or "availability"' },
  { phrase: "north star", suggestion: '"goal" or "priority"' },
  { phrase: "deep dive", suggestion: '"close look," "analysis," or "review"' },
  { phrase: "wheelhouse", suggestion: '"area of expertise" or "specialty"' },
  { phrase: "take offline", suggestion: '"discuss separately" or "follow up on"' },
  { phrase: "circle back", suggestion: '"follow up" or "return to"' },
  { phrase: "move the needle", suggestion: "Describe the specific change or impact" },
  { phrase: "boil the ocean", suggestion: '"try to solve everything at once"' },
  { phrase: "low-hanging fruit", suggestion: '"easy wins" or "quick fixes"' },
  { phrase: "low hanging fruit", suggestion: '"easy wins" or "quick fixes"' },
  { phrase: "value-add", suggestion: '"benefit" or describe the specific value' },
  { phrase: "value add", suggestion: '"benefit" or describe the specific value' },
  { phrase: "action item", suggestion: '"task" or "to-do"' },
  { phrase: "deliverable", suggestion: '"result," "output," or be specific' },
  { phrase: "stakeholder", suggestion: '"people involved," "team," or name them' },
  { phrase: "touch base", suggestion: '"check in" or "talk"' },
  { phrase: "ping", suggestion: '"message" or "contact"' },
  { phrase: "ideate", suggestion: '"brainstorm" or "think of ideas"' },
  { phrase: "ideation", suggestion: '"brainstorming"' },
  { phrase: "socialize", suggestion: '"share" or "discuss with the team"' },
  { phrase: "productize", suggestion: '"turn into a product"' },
  { phrase: "learnings", suggestion: '"lessons" or "findings"' },
  { phrase: "impact", suggestion: 'Use as a noun not a verb: "affect" or "influence"' },
  { phrase: "surface", suggestion: '"raise," "share," or "bring up"' },
  { phrase: "unpack", suggestion: '"explain" or "break down"' },
  { phrase: "double-click", suggestion: '"examine more closely" or "dig into"' },
  { phrase: "double click", suggestion: '"examine more closely" or "dig into"' },
  { phrase: "optics", suggestion: '"how it looks" or "perception"' },
  { phrase: "pivot", suggestion: '"change direction" or "switch approach"' },
  { phrase: "scale", suggestion: '"grow" or "expand" \u2014 be specific' },
  { phrase: "at scale", suggestion: '"at a larger size" or be specific' },
  { phrase: "agile", suggestion: "Use only when referring to the methodology specifically" },
  { phrase: "bandwidth", suggestion: '"time" or "capacity"' },
  { phrase: "ecosystem", suggestion: '"community," "tooling," or be specific' },
  { phrase: "mission-critical", suggestion: '"essential" or "critical"' }
];
function escapeRegex3(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function detectJargon(text) {
  const findings = [];
  for (const { phrase, suggestion } of JARGON) {
    const re = new RegExp(`\\b${escapeRegex3(phrase)}\\b`, "gi");
    let m;
    while ((m = re.exec(text)) !== null) {
      findings.push({
        categoryId: CATEGORY_IDS.JARGON,
        categoryLabel: "Corporate Jargon",
        text: m[0],
        from: m.index,
        to: m.index + m[0].length,
        suggestion
      });
    }
  }
  return findings;
}

// src/rules/sentence-monotony.ts
var SENTENCE_END = /[^.!?]*[.!?]+/g;
var MIN_SENTENCES = 4;
var CV_THRESHOLD = 0.25;
var CLUSTER_SIZE = 3;
var SIMILAR_WORDS_DELTA = 3;
function parseSentences(text) {
  const sentences = [];
  let m;
  SENTENCE_END.lastIndex = 0;
  while ((m = SENTENCE_END.exec(text)) !== null) {
    const raw = m[0].trim();
    if (!raw)
      continue;
    const words = raw.split(/\s+/).filter(Boolean);
    if (words.length < 3)
      continue;
    sentences.push({
      text: raw,
      from: m.index,
      to: m.index + m[0].length,
      wordCount: words.length
    });
  }
  return sentences;
}
function stdDev(values) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}
function detectSentenceMonotony(text) {
  const sentences = parseSentences(text);
  if (sentences.length < MIN_SENTENCES)
    return [];
  const findings = [];
  const lengths = sentences.map((s) => s.wordCount);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const cv = mean > 0 ? stdDev(lengths) / mean : 0;
  if (cv < CV_THRESHOLD) {
    let clusterStart = 0;
    for (let i = 1; i <= sentences.length; i++) {
      const inCluster = i < sentences.length && Math.abs(sentences[i].wordCount - sentences[clusterStart].wordCount) <= SIMILAR_WORDS_DELTA;
      if (!inCluster) {
        const clusterLen = i - clusterStart;
        if (clusterLen >= CLUSTER_SIZE) {
          const first = sentences[clusterStart];
          const last = sentences[i - 1];
          findings.push({
            categoryId: CATEGORY_IDS.MONOTONY,
            categoryLabel: "Sentence Monotony",
            text: text.slice(first.from, last.to),
            from: first.from,
            to: last.to,
            suggestion: `${clusterLen} consecutive sentences of similar length (~${Math.round(mean)} words). Vary sentence length and structure.`
          });
        }
        clusterStart = i;
      }
    }
  }
  return findings;
}

// src/rules/fake-enthusiasm.ts
var ENTHUSIASM = [
  { phrase: "absolutely amazing", suggestion: "What specifically makes it good?" },
  { phrase: "literally unprecedented", suggestion: "What has never happened before, exactly?" },
  { phrase: "mind-blowing", suggestion: '"surprising," "impressive," or be specific' },
  { phrase: "mind blowing", suggestion: '"surprising," "impressive," or be specific' },
  { phrase: "state-of-the-art", suggestion: '"new," "recent," or name the specific technology' },
  { phrase: "state of the art", suggestion: '"new," "recent," or name the specific technology' },
  { phrase: "groundbreaking", suggestion: "Describe what ground it breaks" },
  { phrase: "revolutionary", suggestion: "Describe what it changes and how" },
  { phrase: "game-changing", suggestion: "Describe what specifically changes" },
  { phrase: "game changing", suggestion: "Describe what specifically changes" },
  { phrase: "world-class", suggestion: "Provide evidence or cut it" },
  { phrase: "best-in-class", suggestion: "Provide evidence or cut it" },
  { phrase: "unparalleled", suggestion: "What is it being compared to?" },
  { phrase: "unprecedented", suggestion: "Describe what has not happened before" },
  { phrase: "exceptional", suggestion: "Describe what makes it an exception" },
  { phrase: "extraordinary", suggestion: "Describe what makes it extraordinary" },
  { phrase: "amazing", suggestion: "What specifically impresses you?" },
  { phrase: "incredible", suggestion: '"notable," "impressive," or be specific' },
  { phrase: "unbelievable", suggestion: '"notable," "impressive," or be specific' },
  { phrase: "spectacular", suggestion: "Be specific about what you observed" },
  { phrase: "phenomenal", suggestion: "Be specific" }
];
var MULTI_EXCLAIM_RE = /!{2,}/g;
function escapeRegex4(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function detectFakeEnthusiasm(text) {
  const findings = [];
  for (const { phrase, suggestion } of ENTHUSIASM) {
    const re = new RegExp(`\\b${escapeRegex4(phrase)}\\b`, "gi");
    let m2;
    while ((m2 = re.exec(text)) !== null) {
      findings.push({
        categoryId: CATEGORY_IDS.ENTHUSIASM,
        categoryLabel: "Fake Enthusiasm",
        text: m2[0],
        from: m2.index,
        to: m2.index + m2[0].length,
        suggestion
      });
    }
  }
  let m;
  MULTI_EXCLAIM_RE.lastIndex = 0;
  while ((m = MULTI_EXCLAIM_RE.exec(text)) !== null) {
    findings.push({
      categoryId: CATEGORY_IDS.ENTHUSIASM,
      categoryLabel: "Fake Enthusiasm",
      text: m[0],
      from: m.index,
      to: m.index + m[0].length,
      suggestion: "One exclamation mark is usually enough. Consider whether any is needed."
    });
  }
  return findings;
}

// src/rules/adverb-overuse.ts
var FLAGGED_ADVERBS = [
  "meticulously",
  "seamlessly",
  "remarkably",
  "effortlessly",
  "comprehensively",
  "significantly",
  "particularly",
  "fundamentally",
  "ultimately",
  "undoubtedly",
  "absolutely",
  "definitely",
  "obviously",
  "simply",
  "highly",
  "deeply",
  "greatly",
  "carefully",
  "precisely",
  "thoughtfully",
  "strategically",
  "effectively",
  "efficiently",
  "continuously",
  "constantly",
  "completely",
  "entirely",
  "perfectly",
  "incredibly",
  "tremendously",
  "immensely",
  "vastly",
  "exceptionally"
];
var FLAGGED_RE = new RegExp(`\\b(${FLAGGED_ADVERBS.join("|")})\\b`, "gi");
var CLUSTER_WINDOW = 200;
var CLUSTER_MIN = 3;
function detectAdverbOveruse(text) {
  const allMatches = [];
  let m;
  FLAGGED_RE.lastIndex = 0;
  while ((m = FLAGGED_RE.exec(text)) !== null) {
    allMatches.push({ text: m[0], from: m.index, to: m.index + m[0].length });
  }
  const findings = [];
  const flaggedAsCluster = /* @__PURE__ */ new Set();
  for (let i = 0; i < allMatches.length; i++) {
    const windowEnd = allMatches[i].from + CLUSTER_WINDOW;
    let j = i;
    while (j < allMatches.length && allMatches[j].from <= windowEnd)
      j++;
    const count = j - i;
    if (count >= CLUSTER_MIN) {
      for (let k = i; k < j; k++)
        flaggedAsCluster.add(k);
    }
  }
  if (flaggedAsCluster.size > 0) {
    for (const idx of flaggedAsCluster) {
      const match = allMatches[idx];
      findings.push({
        categoryId: CATEGORY_IDS.ADVERBS,
        categoryLabel: "Adverb Overuse",
        text: match.text,
        from: match.from,
        to: match.to,
        suggestion: `Remove or replace "${match.text}" \u2014 it is part of an adverb cluster. Show, don't modify.`
      });
    }
  } else {
    const seen = /* @__PURE__ */ new Map();
    for (let i = 0; i < allMatches.length; i++) {
      const key = allMatches[i].text.toLowerCase();
      if (!seen.has(key))
        seen.set(key, []);
      seen.get(key).push(i);
    }
    for (const [word, indices] of seen) {
      if (indices.length >= 2) {
        for (const idx of indices) {
          const match = allMatches[idx];
          findings.push({
            categoryId: CATEGORY_IDS.ADVERBS,
            categoryLabel: "Adverb Overuse",
            text: match.text,
            from: match.from,
            to: match.to,
            suggestion: `"${word}" appears ${indices.length} times. Cut or replace it \u2014 stronger verbs often remove the need.`
          });
        }
      }
    }
  }
  return findings;
}

// src/rules/list-addiction.ts
var TRANSITIONS = [
  "firstly",
  "secondly",
  "thirdly",
  "fourthly",
  "fifthly",
  "lastly",
  "finally",
  "moreover",
  "furthermore",
  "additionally",
  "in addition",
  "also",
  "besides",
  "likewise",
  "in conclusion",
  "to summarize",
  "to conclude",
  "in summary",
  "to begin with",
  "first of all",
  "last but not least"
];
var MIN_TRANSITIONS = 3;
function escapeRegex5(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function detectListAddiction(text) {
  const matches = [];
  for (const phrase of TRANSITIONS) {
    const re = new RegExp(`\\b${escapeRegex5(phrase)}\\b`, "gi");
    let m;
    while ((m = re.exec(text)) !== null) {
      matches.push({ text: m[0], from: m.index, to: m.index + m[0].length });
    }
  }
  if (matches.length < MIN_TRANSITIONS)
    return [];
  matches.sort((a, b) => a.from - b.from);
  return matches.map(({ text: text2, from, to }) => ({
    categoryId: CATEGORY_IDS.LISTS,
    categoryLabel: "List Addiction",
    text: text2,
    from,
    to,
    suggestion: `${matches.length} list-transition words found. Prose flows better without sequential signposting \u2014 try connecting ideas directly.`
  }));
}

// src/rules/custom.ts
function escapeRegex6(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function detectCustomRules(text, rules) {
  var _a;
  const findings = [];
  for (const rule of rules) {
    if (!rule.enabled || !rule.phrase.trim())
      continue;
    const re = new RegExp(`\\b${escapeRegex6(rule.phrase.trim())}\\b`, "gi");
    let m;
    while ((m = re.exec(text)) !== null) {
      findings.push({
        categoryId: rule.categoryId,
        categoryLabel: (_a = CATEGORY_LABELS[rule.categoryId]) != null ? _a : "Custom Rules",
        text: m[0],
        from: m.index,
        to: m.index + m[0].length,
        suggestion: rule.suggestion || void 0
      });
    }
  }
  return findings;
}

// src/analyzer.ts
function getCodeBlockRanges(text) {
  const ranges = [];
  const fenced = /^[ \t]*(```+|~~~+)[^\n]*\n[\s\S]*?\n[ \t]*\1[ \t]*$/gm;
  let m;
  while ((m = fenced.exec(text)) !== null) {
    ranges.push({ from: m.index, to: m.index + m[0].length });
  }
  const inline = /`[^`\n]+`/g;
  while ((m = inline.exec(text)) !== null) {
    const inFenced = ranges.some((r) => m.index >= r.from && m.index + m[0].length <= r.to);
    if (!inFenced) {
      ranges.push({ from: m.index, to: m.index + m[0].length });
    }
  }
  return ranges;
}
function isInsideCodeBlock(from, to, ranges) {
  return ranges.some((r) => from >= r.from && to <= r.to);
}
function countWords(text) {
  return text.split(/\s+/).filter((s) => s.length > 0).length;
}
var CATEGORY_WEIGHT = {
  cliches: 2.5,
  filler: 2,
  passive: 1,
  jargon: 2.5,
  monotony: 1.5,
  enthusiasm: 2,
  adverbs: 1.5,
  lists: 1.5
};
function analyze(text, offset = 0, customRules = []) {
  const codeRanges = getCodeBlockRanges(text);
  const runners = [
    detectCliches,
    detectFiller,
    detectPassiveVoice,
    detectJargon,
    detectSentenceMonotony,
    detectFakeEnthusiasm,
    detectAdverbOveruse,
    detectListAddiction
  ];
  let allFindings = [
    ...runners.flatMap((fn) => fn(text)),
    ...detectCustomRules(text, customRules)
  ];
  allFindings = allFindings.filter(
    (f) => !isInsideCodeBlock(f.from, f.to, codeRanges)
  );
  const seen = /* @__PURE__ */ new Set();
  allFindings = allFindings.filter((f) => {
    const key = `${f.from}:${f.to}:${f.categoryId}`;
    if (seen.has(key))
      return false;
    seen.add(key);
    return true;
  });
  allFindings.sort((a, b) => a.from - b.from);
  const wordCount = Math.max(1, countWords(text));
  const weightedSum = allFindings.reduce(
    (sum, f) => {
      var _a;
      return sum + ((_a = CATEGORY_WEIGHT[f.categoryId]) != null ? _a : 1);
    },
    0
  );
  const score = Math.min(100, Math.round(weightedSum / wordCount * 100 * 3));
  return { findings: allFindings, score, wordCount, offset };
}

// src/decorations.ts
var import_state = require("@codemirror/state");
var import_view = require("@codemirror/view");
var setUnslopFindings = import_state.StateEffect.define();
var clearUnslopFindings = import_state.StateEffect.define();
var unslopField = import_state.StateField.define({
  create() {
    return import_view.Decoration.none;
  },
  update(deco, tr) {
    deco = deco.map(tr.changes);
    for (const effect of tr.effects) {
      if (effect.is(clearUnslopFindings)) {
        return import_view.Decoration.none;
      }
      if (effect.is(setUnslopFindings)) {
        const { result } = effect.value;
        const marks = result.findings.map(
          (f) => import_view.Decoration.mark({
            class: `unslop-mark unslop-${f.categoryId}`,
            attributes: {
              "title": `${f.categoryLabel}${f.suggestion ? ": " + f.suggestion : ""}`,
              "data-unslop-category": f.categoryId
            }
          }).range(f.from + result.offset, f.to + result.offset)
        ).sort((a, b) => a.from - b.from || a.to - b.to);
        const filtered = [];
        let lastTo = -1;
        for (const mark of marks) {
          if (mark.from >= lastTo) {
            filtered.push(mark);
            lastTo = mark.to;
          }
        }
        return import_view.Decoration.set(filtered);
      }
    }
    return deco;
  },
  provide: (f) => import_view.EditorView.decorations.from(f)
});
function buildUnslopExtension() {
  return [unslopField];
}

// src/view.ts
var import_obsidian2 = require("obsidian");

// src/prompt.ts
var PROMPT_INTRO = `You are a sharp writing editor. The text below has been flagged for AI writing patterns ("slop"). Your job is to rewrite it cleanly.

## Rules
- Fix every flagged issue
- Preserve the author's voice, intent, and all factual content
- Use plain, direct language \u2014 cut what adds no meaning
- Do not introduce new clich\xE9s, jargon, or filler
- Vary sentence length and structure where monotony is flagged
- Return only the rewritten text, no commentary

## Detected Issues
`;
function buildIssuesList(result) {
  var _a;
  const groups = /* @__PURE__ */ new Map();
  for (const f of result.findings) {
    if (!groups.has(f.categoryId))
      groups.set(f.categoryId, []);
    groups.get(f.categoryId).push(f);
  }
  const lines = [];
  for (const [categoryId, findings] of groups) {
    const label = (_a = CATEGORY_LABELS[categoryId]) != null ? _a : categoryId;
    lines.push(`### ${label}`);
    for (const f of findings) {
      const suggestion = f.suggestion ? ` \u2192 ${f.suggestion}` : "";
      lines.push(`- "${f.text}"${suggestion}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}
function buildPrompt(result, mode, content, filePath) {
  const issuesList = buildIssuesList(result);
  const scoreNote = `Slop score: ${result.score}/100 (${result.findings.length} issue${result.findings.length !== 1 ? "s" : ""} across ${result.wordCount} words)

`;
  let textSection;
  if (mode === "path") {
    textSection = `## File
${filePath}

(Open the file and use the issues list above to guide your edits.)`;
  } else {
    textSection = `## Text to Rewrite
\`\`\`
${content}
\`\`\``;
  }
  return PROMPT_INTRO + scoreNote + issuesList + "\n---\n\n" + textSection;
}

// src/ai/provider.ts
var import_obsidian = require("obsidian");
var PROVIDER_LABELS = {
  openai: "OpenAI",
  anthropic: "Anthropic (Claude)",
  google: "Google Gemini",
  mistral: "Mistral",
  cohere: "Cohere",
  openrouter: "OpenRouter"
};
var DEFAULT_MODELS = {
  openai: "gpt-4o",
  anthropic: "claude-3-5-sonnet-20241022",
  google: "gemini-1.5-pro-latest",
  mistral: "mistral-large-latest",
  cohere: "command-r-plus-08-2024",
  openrouter: "openai/gpt-4o"
};
var PROVIDER_DOCS = {
  openai: "https://platform.openai.com/api-keys",
  anthropic: "https://console.anthropic.com/keys",
  google: "https://aistudio.google.com/app/apikey",
  mistral: "https://console.mistral.ai/api-keys",
  cohere: "https://dashboard.cohere.com/api-keys",
  openrouter: "https://openrouter.ai/keys"
};
async function openAICompletions(baseUrl, apiKey, model, systemPrompt, userMessage, extraHeaders) {
  var _a, _b, _c;
  const res = await (0, import_obsidian.requestUrl)({
    url: `${baseUrl}/chat/completions`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      ...extraHeaders
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.3,
      max_tokens: 2048
    })
  });
  const data = res.json;
  const content = (_c = (_b = (_a = data == null ? void 0 : data.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content;
  if (!content)
    throw new Error(`Unexpected response from API: ${JSON.stringify(data)}`);
  return content.trim();
}
async function anthropicMessages(apiKey, model, systemPrompt, userMessage) {
  var _a, _b;
  const res = await (0, import_obsidian.requestUrl)({
    url: "https://api.anthropic.com/v1/messages",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
      max_tokens: 2048
    })
  });
  const data = res.json;
  const content = (_b = (_a = data == null ? void 0 : data.content) == null ? void 0 : _a[0]) == null ? void 0 : _b.text;
  if (!content)
    throw new Error(`Unexpected Anthropic response: ${JSON.stringify(data)}`);
  return content.trim();
}
async function googleGemini(apiKey, model, systemPrompt, userMessage) {
  var _a, _b, _c, _d, _e;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await (0, import_obsidian.requestUrl)({
    url,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
    })
  });
  const data = res.json;
  const content = (_e = (_d = (_c = (_b = (_a = data == null ? void 0 : data.candidates) == null ? void 0 : _a[0]) == null ? void 0 : _b.content) == null ? void 0 : _c.parts) == null ? void 0 : _d[0]) == null ? void 0 : _e.text;
  if (!content)
    throw new Error(`Unexpected Gemini response: ${JSON.stringify(data)}`);
  return content.trim();
}
async function cohereChat(apiKey, model, systemPrompt, userMessage) {
  var _a, _b, _c;
  const res = await (0, import_obsidian.requestUrl)({
    url: "https://api.cohere.ai/v2/chat",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    })
  });
  const data = res.json;
  const content = (_c = (_b = (_a = data == null ? void 0 : data.message) == null ? void 0 : _a.content) == null ? void 0 : _b[0]) == null ? void 0 : _c.text;
  if (!content)
    throw new Error(`Unexpected Cohere response: ${JSON.stringify(data)}`);
  return content.trim();
}
async function callAI(config, systemPrompt, userMessage) {
  const { provider, apiKey, model, baseUrl } = config;
  switch (provider) {
    case "openai":
      return openAICompletions(
        baseUrl || "https://api.openai.com/v1",
        apiKey,
        model,
        systemPrompt,
        userMessage
      );
    case "anthropic":
      return anthropicMessages(apiKey, model, systemPrompt, userMessage);
    case "google":
      return googleGemini(apiKey, model, systemPrompt, userMessage);
    case "mistral":
      return openAICompletions(
        baseUrl || "https://api.mistral.ai/v1",
        apiKey,
        model,
        systemPrompt,
        userMessage
      );
    case "cohere":
      return cohereChat(apiKey, model, systemPrompt, userMessage);
    case "openrouter":
      return openAICompletions(
        baseUrl || "https://openrouter.ai/api/v1",
        apiKey,
        model,
        systemPrompt,
        userMessage,
        { "HTTP-Referer": "obsidian-unslop", "X-Title": "Unslop" }
      );
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}
var REWRITE_SYSTEM = `You are a sharp writing editor. Your only job is to rewrite the text the user gives you, fixing the specific issues listed. Rules:
- Return ONLY the rewritten text \u2014 no explanation, no preamble, no quotation marks around it
- Preserve all factual content and the author's voice
- Use plain, direct language
- Do not introduce new clich\xE9s, jargon, or filler`;
async function rewriteParagraph(config, paragraph, issues) {
  const issueList = issues.map((i) => `- "${i.text}"${i.suggestion ? ` \u2192 ${i.suggestion}` : ""}`).join("\n");
  const userMessage = `Fix these issues in the following text:
${issueList}

---

${paragraph}`;
  return callAI(config, REWRITE_SYSTEM, userMessage);
}

// src/view.ts
var VIEW_TYPE_UNSLOP = "unslop-view";
var SCORE_LABELS = [
  { max: 20, label: "Clean", cls: "unslop-score-clean" },
  { max: 50, label: "Mild", cls: "unslop-score-mild" },
  { max: 75, label: "Sloppy", cls: "unslop-score-sloppy" },
  { max: 101, label: "Very sloppy", cls: "unslop-score-heavy" }
];
function getParagraphAt(text, pos) {
  let from = text.lastIndexOf("\n\n", pos);
  from = from === -1 ? 0 : from + 2;
  let to = text.indexOf("\n\n", pos);
  if (to === -1)
    to = text.length;
  return { text: text.slice(from, to), from, to };
}
var UnslopView = class extends import_obsidian2.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.result = null;
    this.analysisContent = "";
    this.analysisFilePath = "";
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_UNSLOP;
  }
  getDisplayText() {
    return "Unslop";
  }
  getIcon() {
    return "scan-text";
  }
  onOpen() {
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass("unslop-root");
    this.contentEl2 = root.createDiv({ cls: "unslop-content" });
    this.renderEmpty();
    return Promise.resolve();
  }
  onClose() {
    return Promise.resolve();
  }
  showResult(result, content, filePath) {
    this.result = result;
    this.analysisContent = content;
    this.analysisFilePath = filePath;
    this.renderResult();
  }
  clearResult() {
    this.result = null;
    this.renderEmpty();
  }
  // ── Rendering ─────────────────────────────────────────────────────────────
  renderEmpty() {
    this.contentEl2.empty();
    const empty = this.contentEl2.createDiv({ cls: "unslop-empty" });
    empty.createEl("p", { text: 'Run the "analyze note" command to scan the active document.' });
  }
  renderResult() {
    var _a, _b, _c;
    const result = this.result;
    this.contentEl2.empty();
    const header = this.contentEl2.createDiv({ cls: "unslop-header" });
    const scoreEntry = (_a = SCORE_LABELS.find((s) => result.score < s.max)) != null ? _a : SCORE_LABELS[SCORE_LABELS.length - 1];
    const scoreBadge = header.createDiv({ cls: `unslop-score-badge ${scoreEntry.cls}` });
    scoreBadge.createSpan({ cls: "unslop-score-number", text: String(result.score) });
    scoreBadge.createSpan({ cls: "unslop-score-label", text: scoreEntry.label });
    const meta = header.createDiv({ cls: "unslop-meta" });
    meta.createSpan({ text: `${result.findings.length} issue${result.findings.length !== 1 ? "s" : ""}` });
    meta.createSpan({ text: " \xB7 " });
    meta.createSpan({ text: `${result.wordCount} words` });
    const toolbar = this.contentEl2.createDiv({ cls: "unslop-toolbar" });
    this.renderPromptButton(toolbar);
    const clearBtn = toolbar.createEl("button", { cls: "unslop-btn-ghost", text: "Clear" });
    this.registerDomEvent(clearBtn, "click", () => {
      this.plugin.clearDecorations();
      this.clearResult();
    });
    if (result.findings.length === 0) {
      this.contentEl2.createDiv({ cls: "unslop-empty" }).createEl("p", { text: "No issues found." });
      return;
    }
    const groups = /* @__PURE__ */ new Map();
    for (const f of result.findings) {
      if (!groups.has(f.categoryId))
        groups.set(f.categoryId, []);
      groups.get(f.categoryId).push(f);
    }
    for (const [categoryId, findings] of groups) {
      const color = (_b = CATEGORY_COLORS[categoryId]) != null ? _b : "#aaa";
      const label = (_c = CATEGORY_LABELS[categoryId]) != null ? _c : categoryId;
      const section = this.contentEl2.createDiv({ cls: "unslop-section" });
      const sectionHeader = section.createDiv({ cls: "unslop-section-header" });
      const swatch = sectionHeader.createSpan({ cls: "unslop-swatch" });
      swatch.style.background = color;
      sectionHeader.createSpan({ cls: "unslop-section-title", text: label });
      sectionHeader.createSpan({ cls: "unslop-section-count", text: String(findings.length) });
      const chevron = sectionHeader.createSpan({ cls: "unslop-chevron" });
      (0, import_obsidian2.setIcon)(chevron, "chevron-down");
      const body = section.createDiv({ cls: "unslop-section-body" });
      this.registerDomEvent(sectionHeader, "click", () => {
        const collapsed = body.hasClass("unslop-collapsed");
        body.toggleClass("unslop-collapsed", !collapsed);
        chevron.empty();
        (0, import_obsidian2.setIcon)(chevron, collapsed ? "chevron-down" : "chevron-right");
      });
      for (const f of findings) {
        this.renderFinding(body, f, color);
      }
    }
  }
  renderFinding(container, f, color) {
    const result = this.result;
    const item = container.createDiv({ cls: "unslop-finding" });
    const chip = item.createDiv({ cls: "unslop-chip" });
    chip.style.borderLeftColor = color;
    chip.createSpan({ cls: "unslop-chip-text", text: `"${f.text}"` });
    const jumpBtn = chip.createEl("button", { cls: "unslop-icon-btn" });
    (0, import_obsidian2.setIcon)(jumpBtn, "arrow-right");
    jumpBtn.setAttribute("aria-label", "Jump to location");
    this.registerDomEvent(jumpBtn, "click", (e) => {
      e.stopPropagation();
      this.jumpTo(f.from + result.offset, f.to + result.offset);
    });
    if (this.plugin.settings.aiApiKey) {
      const rewriteBtn = chip.createEl("button", { cls: "unslop-icon-btn unslop-rewrite-btn" });
      (0, import_obsidian2.setIcon)(rewriteBtn, "wand");
      rewriteBtn.setAttribute("aria-label", "AI rewrite paragraph");
      this.registerDomEvent(rewriteBtn, "click", (e) => {
        e.stopPropagation();
        void this.handleRewrite(item, f);
      });
    }
    if (f.suggestion) {
      item.createDiv({ cls: "unslop-suggestion", text: f.suggestion });
    }
  }
  // ── AI Rewrite ────────────────────────────────────────────────────────────
  async handleRewrite(item, finding) {
    var _a;
    const result = this.result;
    const s = this.plugin.settings;
    const para = getParagraphAt(this.analysisContent, finding.from);
    const paraFindings = result.findings.filter(
      (f) => f.from >= para.from && f.to <= para.to
    );
    (_a = item.querySelector(".unslop-rewrite-area")) == null ? void 0 : _a.remove();
    const area = item.createDiv({ cls: "unslop-rewrite-area" });
    const spinner = area.createDiv({ cls: "unslop-spinner", text: "Rewriting\u2026" });
    try {
      const rewritten = await rewriteParagraph(
        { provider: s.aiProvider, apiKey: s.aiApiKey, model: s.aiModel, baseUrl: s.aiBaseUrl },
        para.text,
        paraFindings.map((f) => ({ text: f.text, suggestion: f.suggestion }))
      );
      spinner.remove();
      this.renderRewritePreview(area, para, rewritten);
    } catch (err) {
      spinner.remove();
      area.createEl("p", { cls: "unslop-rewrite-error", text: `Error: ${err.message}` });
      const dismiss = area.createEl("button", { cls: "unslop-btn-ghost", text: "Dismiss" });
      this.registerDomEvent(dismiss, "click", () => area.remove());
    }
  }
  renderRewritePreview(area, para, rewritten) {
    area.createEl("p", { cls: "unslop-rewrite-label", text: "Suggested rewrite:" });
    area.createEl("blockquote", { cls: "unslop-rewrite-preview", text: rewritten });
    const actions = area.createDiv({ cls: "unslop-rewrite-actions" });
    const acceptBtn = actions.createEl("button", { cls: "unslop-btn-primary", text: "Accept" });
    this.registerDomEvent(acceptBtn, "click", () => {
      this.applyRewrite(para, rewritten);
      area.remove();
      new import_obsidian2.Notice("Rewrite applied");
    });
    const copyBtn = actions.createEl("button", { cls: "unslop-btn-ghost", text: "Copy" });
    this.registerDomEvent(copyBtn, "click", async () => {
      await navigator.clipboard.writeText(rewritten);
      new import_obsidian2.Notice("Copied to clipboard");
    });
    const dismissBtn = actions.createEl("button", { cls: "unslop-btn-ghost", text: "Dismiss" });
    this.registerDomEvent(dismissBtn, "click", () => area.remove());
  }
  applyRewrite(para, rewritten) {
    const leaf = this.app.workspace.getMostRecentLeaf();
    if (!leaf || !(leaf.view instanceof import_obsidian2.MarkdownView))
      return;
    const editor = leaf.view.editor;
    const result = this.result;
    const absFrom = para.from + result.offset;
    const absTo = para.to + result.offset;
    editor.replaceRange(rewritten, editor.offsetToPos(absFrom), editor.offsetToPos(absTo));
  }
  // ── Prompt button ─────────────────────────────────────────────────────────
  renderPromptButton(toolbar) {
    const wrap = toolbar.createDiv({ cls: "unslop-prompt-wrap" });
    const btn = wrap.createEl("button", { cls: "unslop-btn-primary" });
    (0, import_obsidian2.setIcon)(btn.createSpan(), "clipboard-copy");
    btn.createSpan({ text: " Copy AI prompt" });
    this.registerDomEvent(btn, "click", () => this.copyPrompt());
    const toggle = wrap.createDiv({ cls: "unslop-mode-toggle" });
    const modes = [
      { value: "content", label: "Content", title: "Embed document text in the prompt (recommended)" },
      { value: "path", label: "Path", title: "Include file path only" }
    ];
    const render = () => {
      toggle.empty();
      for (const { value, label, title } of modes) {
        const opt = toggle.createEl("button", {
          cls: `unslop-mode-opt ${this.plugin.settings.promptMode === value ? "is-active" : ""}`,
          text: label,
          title
        });
        this.registerDomEvent(opt, "click", async () => {
          this.plugin.settings.promptMode = value;
          await this.plugin.saveSettings();
          render();
        });
      }
      if (this.plugin.settings.promptMode === "content") {
        toggle.createSpan({ cls: "unslop-rec", text: "(recommended)" });
      }
    };
    render();
  }
  async copyPrompt() {
    if (!this.result)
      return;
    const prompt = buildPrompt(
      this.result,
      this.plugin.settings.promptMode,
      this.analysisContent,
      this.analysisFilePath
    );
    await navigator.clipboard.writeText(prompt);
    new import_obsidian2.Notice("AI prompt copied to clipboard");
  }
  // ── Navigation ────────────────────────────────────────────────────────────
  jumpTo(from, to) {
    const leaf = this.app.workspace.getMostRecentLeaf();
    if (!leaf || !(leaf.view instanceof import_obsidian2.MarkdownView))
      return;
    const editor = leaf.view.editor;
    const fromPos = editor.offsetToPos(from);
    const toPos = editor.offsetToPos(to);
    editor.setSelection(fromPos, toPos);
    editor.scrollIntoView({ from: fromPos, to: toPos }, true);
    leaf.view.editor.focus();
  }
};

// src/settings.ts
var import_obsidian3 = require("obsidian");
var DEFAULT_SETTINGS = {
  promptMode: "content",
  customRules: [],
  aiProvider: "openai",
  aiApiKey: "",
  aiModel: "gpt-4o",
  aiBaseUrl: ""
};
var UnslopSettingTab = class extends import_obsidian3.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian3.Setting(containerEl).setName("Prompt export").setHeading();
    new import_obsidian3.Setting(containerEl).setName("AI prompt mode").setDesc(
      "Include the full document content (recommended \u2014 works with any AI) or just the file path (only if your AI agent can read your local filesystem)."
    ).addDropdown(
      (drop) => drop.addOption("content", "Include content (recommended)").addOption("path", "Link to file path").setValue(this.plugin.settings.promptMode).onChange(async (value) => {
        this.plugin.settings.promptMode = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("AI provider (inline rewrites)").setDesc("Configure an AI provider to use the rewrite button in the side panel.").setHeading();
    let modelTextComp;
    new import_obsidian3.Setting(containerEl).setName("Provider").addDropdown((drop) => {
      for (const [value, label] of Object.entries(PROVIDER_LABELS)) {
        drop.addOption(value, label);
      }
      drop.setValue(this.plugin.settings.aiProvider);
      drop.onChange(async (value) => {
        this.plugin.settings.aiProvider = value;
        const currentModel = this.plugin.settings.aiModel;
        const wasDefault = Object.values(DEFAULT_MODELS).includes(currentModel);
        if (wasDefault) {
          this.plugin.settings.aiModel = DEFAULT_MODELS[value];
          if (modelTextComp)
            modelTextComp.setValue(this.plugin.settings.aiModel);
        }
        await this.plugin.saveSettings();
        this.display();
      });
    });
    const selectedProvider = this.plugin.settings.aiProvider;
    const docsUrl = PROVIDER_DOCS[selectedProvider];
    new import_obsidian3.Setting(containerEl).setName("API key").setDesc(createFragment((frag) => {
      frag.appendText("Paste your API key. Get one at ");
      frag.createEl("a", { text: docsUrl, href: docsUrl });
      frag.appendText(".");
    })).addText((text) => {
      text.setPlaceholder("Paste your key here").setValue(this.plugin.settings.aiApiKey).onChange(async (value) => {
        this.plugin.settings.aiApiKey = value.trim();
        await this.plugin.saveSettings();
      });
      text.inputEl.type = "password";
      text.inputEl.addClass("unslop-input-full");
    });
    new import_obsidian3.Setting(containerEl).setName("Model").setDesc(`Default: ${DEFAULT_MODELS[selectedProvider]}`).addText((text) => {
      modelTextComp = text;
      text.setPlaceholder(DEFAULT_MODELS[selectedProvider]).setValue(this.plugin.settings.aiModel).onChange(async (value) => {
        this.plugin.settings.aiModel = value.trim() || DEFAULT_MODELS[selectedProvider];
        await this.plugin.saveSettings();
      });
      text.inputEl.addClass("unslop-input-full");
    });
    if (selectedProvider === "openrouter" || selectedProvider === "mistral" || selectedProvider === "openai") {
      new import_obsidian3.Setting(containerEl).setName("Base URL (optional)").setDesc("Override the API base URL \u2014 useful for proxies or self-hosted models.").addText((text) => {
        text.setPlaceholder("https://example.com").setValue(this.plugin.settings.aiBaseUrl).onChange(async (value) => {
          this.plugin.settings.aiBaseUrl = value.trim();
          await this.plugin.saveSettings();
        });
        text.inputEl.addClass("unslop-input-full");
      });
    }
    new import_obsidian3.Setting(containerEl).setName("Custom rules").setDesc("Add your own phrases to flag. They will appear in the side panel alongside built-in findings.").setHeading();
    this.renderCustomRules(containerEl);
    new import_obsidian3.Setting(containerEl).addButton(
      (btn) => btn.setButtonText("+ add rule").setCta().onClick(async () => {
        this.plugin.settings.customRules.push({
          id: crypto.randomUUID(),
          phrase: "",
          categoryId: "custom",
          suggestion: "",
          enabled: true
        });
        await this.plugin.saveSettings();
        this.display();
      })
    );
  }
  renderCustomRules(containerEl) {
    const rules = this.plugin.settings.customRules;
    if (rules.length === 0)
      return;
    for (const rule of rules) {
      const setting = new import_obsidian3.Setting(containerEl).setClass("unslop-custom-rule-row").addToggle(
        (toggle) => toggle.setValue(rule.enabled).onChange(async (val) => {
          rule.enabled = val;
          await this.plugin.saveSettings();
        })
      ).addText(
        (text) => text.setPlaceholder("Phrase to flag\u2026").setValue(rule.phrase).onChange(async (val) => {
          rule.phrase = val;
          await this.plugin.saveSettings();
        })
      ).addText(
        (text) => text.setPlaceholder("Suggestion (optional)").setValue(rule.suggestion).onChange(async (val) => {
          rule.suggestion = val;
          await this.plugin.saveSettings();
        })
      ).addExtraButton(
        (btn) => btn.setIcon("trash").setTooltip("Delete rule").onClick(async () => {
          this.plugin.settings.customRules = this.plugin.settings.customRules.filter((r) => r.id !== rule.id);
          await this.plugin.saveSettings();
          this.display();
        })
      );
      setting.settingEl.addClass("unslop-rule-setting");
    }
  }
};

// src/main.ts
var UnslopPlugin = class extends import_obsidian4.Plugin {
  async onload() {
    await this.loadSettings();
    this.registerEditorExtension(buildUnslopExtension());
    this.registerView(VIEW_TYPE_UNSLOP, (leaf) => new UnslopView(leaf, this));
    this.addCommand({
      id: "analyze-note",
      name: "Analyze note",
      editorCallback: (editor, view) => {
        void this.runAnalysis(editor, view);
      }
    });
    this.addCommand({
      id: "clear-analysis",
      name: "Clear analysis",
      editorCallback: (editor) => {
        var _a;
        this.clearDecorations(editor);
        (_a = this.getUnslopView()) == null ? void 0 : _a.clearResult();
      }
    });
    this.addSettingTab(new UnslopSettingTab(this.app, this));
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  // ── Core analysis ──────────────────────────────────────────────────────────
  async runAnalysis(editor, mdView) {
    var _a, _b;
    const hasSelection = editor.somethingSelected();
    let text;
    let offset = 0;
    if (hasSelection) {
      text = editor.getSelection();
      const from = editor.getCursor("from");
      offset = editor.posToOffset(from);
    } else {
      text = editor.getValue();
    }
    const result = analyze(text, offset, this.settings.customRules);
    const cmView = this.getCmView(mdView);
    if (cmView) {
      cmView.dispatch({ effects: setUnslopFindings.of({ result }) });
    }
    const unslopView = await this.openUnslopView();
    const filePath = (_b = (_a = mdView.file) == null ? void 0 : _a.path) != null ? _b : "";
    const fullContent = hasSelection ? text : editor.getValue();
    unslopView == null ? void 0 : unslopView.showResult(result, fullContent, filePath);
  }
  clearDecorations(editor) {
    const mdView = editor ? this.app.workspace.getActiveViewOfType(import_obsidian4.MarkdownView) : this.app.workspace.getActiveViewOfType(import_obsidian4.MarkdownView);
    if (!mdView)
      return;
    const cmView = this.getCmView(mdView);
    cmView == null ? void 0 : cmView.dispatch({ effects: clearUnslopFindings.of() });
  }
  // ── Panel helpers ──────────────────────────────────────────────────────────
  async openUnslopView() {
    const existing = this.getUnslopView();
    if (existing)
      return existing;
    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf)
      return null;
    await leaf.setViewState({ type: VIEW_TYPE_UNSLOP, active: true });
    await this.app.workspace.revealLeaf(leaf);
    return this.getUnslopView();
  }
  getUnslopView() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_UNSLOP)) {
      if (leaf.view instanceof UnslopView)
        return leaf.view;
    }
    return null;
  }
  // ── CodeMirror helpers ─────────────────────────────────────────────────────
  getCmView(mdView) {
    var _a;
    const editor = mdView.editor;
    return (_a = editor.cm) != null ? _a : null;
  }
};
