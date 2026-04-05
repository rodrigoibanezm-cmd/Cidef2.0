// /api/decide.js

import { normalizeDecide } from "../lib/decide/normalize.js";
import { validateDecide } from "../lib/decide/validate.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "method_not_allowed"
    });
  }

  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({
      error: "invalid_body"
    });
  }

  try {
    const normalized = normalizeDecide(body);
    validateDecide(normalized);

    return res.status(200).json(normalized);
  } catch (err) {
    return res.status(400).json({
      error: err?.message || "decide_invalid",
      meta: err?.meta || null
    });
  }
}
