export const parseDate=(dateStr: string): Date | null => {
  const [day, month, year] = dateStr.split('/').map(Number);
  if (!day || !month || !year) return null;

  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
}
