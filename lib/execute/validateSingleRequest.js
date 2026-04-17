// /lib/execute/validateSingleRequest.js

export function validateSingleRequest(request) {
  if (!request || typeof request !== "object" || Array.isArray(request)) {
    return { ok: false, error: "invalid_request_shape" };
  }

  const capa = typeof request.capa === "string"
    ? request.capa.trim().toLowerCase()
    : null;

  if (!capa) {
    return { ok: false, error: "missing_capa" };
  }

  switch (capa) {
    case "ficha": {
      const modelo = typeof request.modelo === "string"
        ? request.modelo.trim().toLowerCase()
        : null;

      const bloque = typeof request.bloque === "string"
        ? request.bloque.trim().toLowerCase()
        : null;

      if (!modelo || !bloque) {
        return { ok: false, error: "invalid_ficha_request" };
      }

      return { ok: true };
    }

    case "cliente":
    case "comercial":
    case "segmento": {
      const modelo = typeof request.modelo === "string"
        ? request.modelo.trim().toLowerCase()
        : null;

      if (!modelo) {
        return { ok: false, error: "invalid_model_request" };
      }

      return { ok: true };
    }

    case "mitos": {
      const scope = typeof request.scope === "string"
        ? request.scope.trim().toLowerCase()
        : null;

      if (!scope) {
        return { ok: false, error: "invalid_mitos_request" };
      }

      return { ok: true };
    }

    default:
      return { ok: false, error: "invalid_capa" };
  }
}
