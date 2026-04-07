/** Etiqueta visible para una clave de color. */
export function colorDisplayLabel(
  key: string,
  labels: Record<string, string>,
): string {
  const t = labels[key];
  if (t && t.trim()) return t.trim();
  if (!key) return "";
  return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
}
