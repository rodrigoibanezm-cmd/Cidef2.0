// /lib/decide/validate.js

const REQUIRED_KEYS = [
  "intent",
  "models",
  "external_models",
  "need_comparative",
  "comparison_mode",
  "focus",
  "trigger"
];

const ALLOWED_INTENT = ["exploracion", "comparacion"];

const ALLOWED_COMPARISON_MODE = ["implicit", "explicit"];

const ALLOWED_TRIGGER = [
  "modelo_directo",
  "comparacion_explicita",
  "necesidad_usuario"
];

const ALLOWED_FOCUS = [
  "precio",
  "espacio",
  "performance",
  "consumo",
  "seguridad",
  "diseño",
  "marca"
];

function fail(msg, meta = {}) {
  const err = new Error(`decide_validation_error:${msg}`);
  err.meta = meta;
  throw err;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

function validateIdArray(arr, fieldName) {
  if (!Array.isArray(arr)) {
    fail(`${fieldName}_not_array`, { value: arr });
  }

  if (!arr.every(isNonEmptyString)) {
    fail(`invalid_${fieldName}_values`, { value: arr });
  }

  if (hasDuplicates(arr)) {
    fail(`${fieldName}_duplicates`, { value: arr });
  }
}

export function validateDecide(d) {

  // 1. SHAPE
  if (!isPlainObject(d)) {
    fail("payload_not_object");
  }

  for (const key of REQUIRED_KEYS) {
    if (!(key in d)) {
      fail("missing_key", { key });
    }
  }

  // 2. DOMINIO

  if (!ALLOWED_INTENT.includes(d.intent)) {
    fail("invalid_intent", { value: d.intent });
  }

  if (!ALLOWED_COMPARISON_MODE.includes(d.comparison_mode)) {
    fail("invalid_comparison_mode", { value: d.comparison_mode });
  }

  if (!ALLOWED_TRIGGER.includes(d.trigger)) {
    fail("invalid_trigger", { value: d.trigger });
  }

  if (typeof d.need_comparative !== "boolean") {
    fail("invalid_need_comparative_type", { value: d.need_comparative });
  }

  // 3. ARRAYS

  validateIdArray(d.models, "models");
  validateIdArray(d.external_models, "external_models");
  validateIdArray(d.focus, "focus");

  // 4. FOCUS

  if (d.focus.length === 0) {
    fail("empty_focus");
  }

  if (d.focus.length > 3) {
    fail("focus_too_large");
  }

  const invalidFocus = d.focus.filter(f => !ALLOWED_FOCUS.includes(f));
  if (invalidFocus.length > 0) {
    fail("invalid_focus_values", { invalidFocus });
  }

  // 5. CONSISTENCIA

  if (d.intent === "exploracion" && d.need_comparative !== false) {
    fail("exploracion_with_comparative");
  }

  if (d.intent === "comparacion" && d.need_comparative !== true) {
    fail("comparacion_without_comparative");
  }

  if (d.comparison_mode === "explicit" && d.need_comparative !== true) {
    fail("explicit_requires_comparative");
  }

  // 🔴 simetría nueva (faltante real)
  if (
    d.intent === "comparacion" &&
    d.comparison_mode === "explicit" &&
    d.trigger !== "comparacion_explicita"
  ) {
    fail("explicit_requires_comparacion_explicita_trigger");
  }

  if (d.trigger === "comparacion_explicita" && d.intent !== "comparacion") {
    fail("comparacion_explicita_requires_comparacion");
  }

  const hasModels =
    d.models.length > 0 || d.external_models.length > 0;

  if (d.intent === "comparacion" && !hasModels) {
    fail("comparacion_without_models");
  }

  if (!hasModels && d.trigger !== "necesidad_usuario") {
    fail("models_empty_without_discovery");
  }

  // overlap (bloqueante real)
  const overlap = d.models.filter(m => d.external_models.includes(m));
  if (overlap.length > 0) {
    fail("models_external_overlap", { overlap });
  }

  return true;
}
