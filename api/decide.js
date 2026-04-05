// /api/decide.js

// import { getDecideLLM } from "../lib/llm/decideLLM.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "method_not_allowed"
    });
  }

  const body = req.body;

  if (!body || typeof body !== "object") {
    return res.status(400).json({
      error: "invalid_body"
    });
  }

  const { input } = body;

  if (typeof input !== "string" || input.trim().length === 0) {
    return res.status(400).json({
      error: "invalid_input"
    });
  }

  try {
    const llm = getDecideLLM();

    const rawOutput = await llm.run(input);

    if (!rawOutput || typeof rawOutput !== "object") {
      return res.status(502).json({
        error: "invalid_llm_response"
      });
    }

    return res.status(200).json({
      raw_decide: rawOutput,
      _meta: {
        source: "llm_decide"
      }
    });

  } catch (err) {
    return res.status(502).json({
      error: "llm_execution_failed"
    });
  }
}
