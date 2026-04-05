// /api/decide.js

export default async function handler(req, res) {
  try {
    const { input } = req.body;

    if (!input || typeof input !== "string") {
      return res.status(400).json({ error: "invalid_input" });
    }

    // ⚠️ LLM decide (placeholder)
    const llmOutput = await runDecideLLM(input);

    // 🔴 Normalización + validación dura
    const result = normalizeDecide(llmOutput);

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({
      error: "decide_error",
      detail: err.message
    });
  }
}


// ----------------------
// 🔴 LLM CALL (mock inicial)
// ----------------------

async function runDecideLLM(input) {
  // 👉 reemplazar por OpenAI call real

  return {
    intent: "comparacion",
    models: ["MAGE"],
    external_models: ["RAV4_2020"],
    need_comparative: true,
    comparison_mode: "explicit",
    focus: ["precio", "seguridad"],
    trigger: "comparacion_explicita"
  };
}


// ----------------------
// 🔴 NORMALIZACIÓN (CRÍTICA)
// ----------------------

function normalizeDecide(d) {

  const ALLOWED_INTENTS = ["exploracion", "comparacion"];
  const ALLOWED_FOCUS = [
    "precio", "espacio", "performance",
    "consumo", "seguridad", "diseño", "marca"
  ];
  const ALLOWED_TRIGGER = [
    "modelo_directo",
    "comparacion_explicita",
    "necesidad_usuario"
  ];

  // -------- intent
  if (!ALLOWED_INTENTS.includes(d.intent)) {
    throw new Error("invalid_intent");
  }

  // -------- models
  const models = Array.isArray(d.models) ? d.models : [];
  const external_models = Array.isArray(d.external_models) ? d.external_models : [];

  // -------- trigger
  if (!ALLOWED_TRIGGER.includes(d.trigger)) {
    throw new Error("invalid_trigger");
  }

  // -------- need_comparative (governed by intent)
  const need_comparative = d.intent === "comparacion";

  // -------- comparison_mode
  let comparison_mode = d.comparison_mode === "explicit" ? "explicit" : "implicit";
  if (comparison_mode === "explicit" && !need_comparative) {
    comparison_mode = "implicit";
  }

  // -------- focus
  let focus = Array.isArray(d.focus)
    ? d.focus.filter(f => ALLOWED_FOCUS.includes(f))
    : [];

  // fallback
  if (focus.length === 0) {
    focus = ["precio"];
  }

  // max 3
  focus = [...new Set(focus)].slice(0, 3);

  // -------- validación crítica
  if (
    models.length === 0 &&
    external_models.length === 0 &&
    d.trigger !== "necesidad_usuario"
  ) {
    throw new Error("invalid_models_state");
  }

  return {
    intent: d.intent,
    models,
    external_models,
    need_comparative,
    comparison_mode,
    focus,
    trigger: d.trigger
  };
}
