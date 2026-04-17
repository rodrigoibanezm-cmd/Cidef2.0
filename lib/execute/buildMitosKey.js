// /lib/execute/buildMitosKey.js

export function buildMitosKey(scope) {
  if (typeof scope !== "string") return null;

  const normalized = scope
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");

  if (normalized === "china") {
    return "cidef:mitos:v1:mitos_v1_china";
  }

  if (normalized === "ev") {
    return "cidef:mitos:v1:mitos_v1_ev";
  }

  if (normalized === "ev_china" || normalized === "china_ev") {
    return "cidef:mitos:v1:mitos_v1_ev_china";
  }

  return null;
}
