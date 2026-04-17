// /lib/execute/validateExecuteBody.js

export function validateExecuteBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "invalid_body" };
  }

  const intent = typeof body.intent === "string"
    ? body.intent.trim().toLowerCase()
    : null;

  const requests = body.requests;
  const externos = body.externos;

  if (!intent) {
    return { ok: false, error: "missing_intent" };
  }

  if (!Array.isArray(requests) || requests.length === 0) {
    return { ok: false, error: "invalid_requests" };
  }

  if (externos !== undefined && !Array.isArray(externos)) {
    return { ok: false, error: "invalid_externos" };
  }

  return { ok: true };
}
