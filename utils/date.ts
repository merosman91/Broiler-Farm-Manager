// utils/date.ts
export function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function calcCycleDay(startDate: string) {
  const start = new Date(startDate);
  const today = new Date();
  const diff = today.getTime() - start.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days + 1;
}
