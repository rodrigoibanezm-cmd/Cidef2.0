// /lib/execute/buildModelKey.js

export function buildModelKey(capa, modelo) {
  if (typeof capa !== "string") return null;
  if (typeof modelo !== "string") return null;

  const normalizedCapa = capa.trim().toLowerCase();
  const normalizedModelo = modelo.trim().toLowerCase();

  if (!normalizedCapa || !normalizedModelo) return null;

  switch (normalizedCapa) {
    case "ficha":
      return `cidef:fichas:v1:ft_v1_${normalizedModelo}`;

    case "cliente":
      return `cidef:clientes:v1:cliente_v1_${normalizedModelo}`;

    case "comercial":
      return `cidef:comercial:v1:comercial_v1_${normalizedModelo}`;

    case "segmento":
      return `cidef:segmento:v1:segmento_v1_${normalizedModelo}`;

    default:
      return null;
  }
}
