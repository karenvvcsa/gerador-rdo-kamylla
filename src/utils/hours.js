// Computes the elapsed time between two "HH:MM" strings, formatted as "8h 30m".
export function computeTotalHours(inicio, termino) {
  if (!inicio || !termino) return '';
  const [h1, m1] = inicio.split(':').map(Number);
  const [h2, m2] = termino.split(':').map(Number);
  if ([h1, m1, h2, m2].some(Number.isNaN)) return '';
  let minutes = h2 * 60 + m2 - (h1 * 60 + m1);
  if (minutes < 0) minutes += 24 * 60;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours}h ${String(remainder).padStart(2, '0')}m` : `${hours}h`;
}
