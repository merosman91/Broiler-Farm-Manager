export function getToday() {
  return new Date().toISOString().split('T')[0]
}

export function calcCycleDay(startDate) {
  if (!startDate) return 1
  
  const start = new Date(startDate)
  const today = new Date()
  const diff = today.getTime() - start.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  return Math.max(1, days + 1)
}

export function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-EG')
}

export function getCurrentDateTime() {
  return new Date().toLocaleString('ar-EG')
}
