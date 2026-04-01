// /lib/render_engine.js

export function renderEngine(input) {
  const { intent, data } = input || {};

  // 1. Validación básica
  if (!Array.isArray(data) || data.length === 0) {
    return "No hay información disponible.";
  }

  // 2. Limitar a máximo 2 modelos
  const models = data.slice(0, 2);

  // 3. Base context
  const primary = models[0];
  const secondary = models[1] || null;

  // 4. Helpers
  const safe = (v) => (v === null || v === undefined ? "" : v);

  // 5. Render según cantidad de modelos
  if (!secondary) {
    // 🔹 Caso 1 modelo
    const p = primary.payload || {};

    return formatOutput([
      title(primary.model_id),
      ...extractKeyPoints(p)
    ]);
  }

  // 🔹 Caso 2 modelos (comparación)
  const p1 = primary.payload || {};
  const p2 = secondary.payload || {};

  return formatOutput([
    title(`${primary.model_id} vs ${secondary.model_id}`),
    ...compareKeyPoints(p1, p2, primary.model_id, secondary.model_id)
  ]);
}

// ------------------------
// Helpers
// ------------------------

function title(text) {
  return `${text.toUpperCase()}`;
}

function formatOutput(lines) {
  return lines.filter(Boolean).join("\n");
}

function extractKeyPoints(payload) {
  // ⚠️ Asume payload ya limpio (backend)
  const points = [];

  if (payload.highlights) {
    points.push(...payload.highlights.slice(0, 3).map(bullet));
  }

  if (payload.weaknesses) {
    points.push(...payload.weaknesses.slice(0, 2).map(warn));
  }

  return points;
}

function compareKeyPoints(p1, p2, m1, m2) {
  const out = [];

  // highlights comparados simples
  if (p1.highlights || p2.highlights) {
    const h1 = (p1.highlights || [])[0];
    const h2 = (p2.highlights || [])[0];

    if (h1 || h2) {
      out.push(bullet(`${m1}: ${safe(h1)}`));
      out.push(bullet(`${m2}: ${safe(h2)}`));
    }
  }

  // weaknesses comparados simples
  if (p1.weaknesses || p2.weaknesses) {
    const w1 = (p1.weaknesses || [])[0];
    const w2 = (p2.weaknesses || [])[0];

    if (w1 || w2) {
      out.push(warn(`${m1}: ${safe(w1)}`));
      out.push(warn(`${m2}: ${safe(w2)}`));
    }
  }

  return out;
}

function bullet(text) {
  return `- ${text}`;
}

function warn(text) {
  return `⚠️ ${text}`;
}
