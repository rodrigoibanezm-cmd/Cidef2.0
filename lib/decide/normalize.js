// /lib/decide/normalize.js

const ALLOWED_FOCUS = [
  "precio",
  "espacio",
  "performance",
  "consumo",
  "seguridad",
  "diseño",
  "marca"
];

const FOCUS_PRIORITY = [
  "precio",
  "seguridad",
  "consumo",
  "espacio",
  "performance",
  "diseño",
  "marca"
];

function norm(v) {
  return typeof v === "string" ? v.trim().toLowerCase() : null;
}

function cleanArray(arr) {
  if (!Array.isArray(arr)) return { cleaned: [], removed: [] };

  const cleaned = [];
  const removed = [];

  for (const v of arr) {
    const n = norm(v);
    if (n && n.length > 0) {
      cleaned.push(n);
    } else {
      removed.push(v);
    }
  }

  const deduped = [...new Set(cleaned)];

  return {
    cleaned: deduped,
    removed
  };
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function normalizeDecide(raw) {

  // 🔴 guard
  const inputIsValid = isPlainObject(raw);
  const input = inputIsValid ? raw : {};

  const rawModels = Array.isArray(input.models) ? input.models : [];
  const rawExternal = Array.isArray(input.external_models) ? input.external_models : [];
  const rawFocus = Array.isArray(input.focus) ? input.focus : [];

  const intent = norm(input.intent);
  const comparison_mode = norm(input.comparison_mode);
  const trigger = norm(input.trigger);

  const modelsResult = cleanArray(rawModels);
  const externalResult = cleanArray(rawExternal);
  const focusResult = cleanArray(rawFocus);

  const models = modelsResult.cleaned;
  const external_models = externalResult.cleaned;

  // 🔴 focus
  const validFocus = focusResult.cleaned.filter(f => ALLOWED_FOCUS.includes(f));
  const removedFocus = focusResult.cleaned.filter(f => !ALLOWED_FOCUS.includes(f));

  let focus = [...validFocus].sort(
    (a, b) => FOCUS_PRIORITY.indexOf(a) - FOCUS_PRIORITY.indexOf(b)
  );

  let usedFallback = false;

  if (focus.length === 0) {
    focus = ["precio"];
    usedFallback = true;
  }

  focus = focus.slice(0, 3);

  // 🔴 derivado
  const llmNeedComparative = input.need_comparative;
  const need_comparative = intent === "comparacion";

  return {
    intent,
    models,
    external_models,
    need_comparative,
    comparison_mode,
    focus,
    trigger,

    _trace: {
      input_was_invalid: !inputIsValid,

      raw_input: {
        intent: input.intent,
        comparison_mode: input.comparison_mode,
        trigger: input.trigger,
        models: rawModels,
        external_models: rawExternal,
        focus: rawFocus,
        need_comparative: llmNeedComparative
      },

      cleaned_input: {
        intent,
        comparison_mode,
        trigger,
        models,
        external_models
      },

      models: {
        removed: modelsResult.removed
      },

      external_models: {
        removed: externalResult.removed
      },

      focus: {
        cleaned: focusResult.cleaned,
        removed_invalid_domain: removedFocus,
        removed_raw: focusResult.removed,
        used_fallback: usedFallback
      }
    }
  };
}
