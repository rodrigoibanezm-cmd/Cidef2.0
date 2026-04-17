// /lib/execute/resolveExecuteRequest.js

import { buildModelKey } from "./buildModelKey.js";
import { buildMitosKey } from "./buildMitosKey.js";
import { loadRedisJson } from "./loadRedisJson.js";

export async function resolveExecuteRequest(request, cache = {}) {
  const capa =
    typeof request.capa === "string"
      ? request.capa.trim().toLowerCase()
      : null;

  if (!capa) {
    return {
      capa: null,
      contenido: null
    };
  }

  if (capa === "mitos") {
    const scope =
      typeof request.scope === "string"
        ? request.scope.trim().toLowerCase()
        : null;

    const key = buildMitosKey(scope);
    const contenido = key ? await loadRedisJson(key, cache) : null;

    return {
      capa,
      scope,
      contenido
    };
  }

  const modelo =
    typeof request.modelo === "string"
      ? request.modelo.trim().toLowerCase()
      : null;

  const key = buildModelKey(capa, modelo);
  const root = key ? await loadRedisJson(key, cache) : null;

  if (capa === "ficha") {
    const bloque =
      typeof request.bloque === "string"
        ? request.bloque.trim().toLowerCase()
        : null;

    return {
      modelo,
      capa,
      bloque,
      contenido: bloque && root ? root[bloque] ?? null : null
    };
  }

  return {
    modelo,
    capa,
    contenido: root
  };
}
