// /api/execute.js

import { validateExecuteBody } from "../lib/execute/validateExecuteBody.js";
import { validateSingleRequest } from "../lib/execute/validateSingleRequest.js";
import { resolveExecuteRequest } from "../lib/execute/resolveExecuteRequest.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "method_not_allowed" });
    }

    const bodyValidation = validateExecuteBody(req.body);

    if (!bodyValidation.ok) {
      return res.status(400).json({ error: bodyValidation.error });
    }

    const { intent, requests, externos = [] } = req.body;
    const cache = {};
    const data = [];

    for (const request of requests) {
      const requestValidation = validateSingleRequest(request);

      if (!requestValidation.ok) {
        return res.status(400).json({ error: requestValidation.error });
      }

      const resolved = await resolveExecuteRequest(request, cache);
      data.push(resolved);
    }

    return res.status(200).json({
      intent,
      externos,
      data
    });
  } catch (error) {
    console.error("execute error:", error);
    return res.status(500).json({ error: "internal_error" });
  }
}
