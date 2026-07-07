export const WEEKDAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

// Converts an <input type="date"> value ("YYYY-MM-DD") to "DD/MM/AAAA".
export function formatDateBR(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return '';
  return `${day}/${month}/${year}`;
}

// Returns the index (0 = SEG ... 6 = DOM) of the weekday for an ISO date string.
export function weekdayIndex(isoDate) {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  const jsDay = date.getDay(); // 0 = Sun ... 6 = Sat
  return (jsDay + 6) % 7; // 0 = Mon ... 6 = Sun
}
