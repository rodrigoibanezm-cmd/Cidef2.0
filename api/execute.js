// /api/execute.js

import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data");

// cache simple por request
async function loadModel(modelo, cache) {
  if (cache[modelo]) return cache[modelo];

  try {
    const filePath = path.join(DATA_PATH, `${modelo}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(raw);

    cache[modelo] = json;
    return json;

  } catch (e) {
    // no rompemos el flujo → devolvemos null
    console.error(`loadModel error: ${modelo}`, e);
    cache[modelo] = null;
    return null;
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "method_not_allowed" });
    }

    const { requests } = req.body || {};

    if (!Array.isArray(requests) || requests.length === 0) {
      return res.status(400).json({ error: "invalid_requests" });
    }

    const cache = {};
    const data = [];

    for (const r of requests) {
      // validación mínima de tipo
      if (!r || typeof r !== "object") {
        return res.status(400).json({ error: "invalid_request_shape" });
      }

      const modelo = String(r.modelo || "").toLowerCase();
      const capa = r.capa;
      const bloque = r.bloque;

      if (!modelo || !capa || !bloque) {
        return res.status(400).json({ error: "invalid_request_shape" });
      }

      const modelJson = await loadModel(modelo, cache);

      const contenido =
        modelJson?.[capa]?.[bloque] ?? null;

      data.push({
        modelo,
        capa,
        bloque,
        contenido
      });
    }

    return res.status(200).json({ data });

  } catch (err) {
    console.error("execute error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}
