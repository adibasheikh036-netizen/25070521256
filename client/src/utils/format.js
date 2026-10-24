const DAY = 24 * 60 * 60 * 1000;

export function greetingFor(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export const firstName = (name = '') => name.trim().split(/\s+/)[0] || 'Student';

export function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts.at(-1)[0] : '')).toUpperCase() || 'S';
}

export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatToday() {
  return new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
}

export function timeLabel(value) {
  if (!value) return '—';
  return new Date(value).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function dayLabel(value) {
  if (!value) return '—';
  const date = new Date(value);
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  if (date >= startOfToday) return 'Today';
  if (date >= startOfToday - DAY) return 'Yesterday';
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

// Day 1 is the day the account was created
export function daysSince(value) {
  if (!value) return 1;
  return Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / DAY) + 1);
}

// "09:30" -> minutes since midnight
export function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// "14:00" -> "2:00 PM"
export function clockLabel(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
