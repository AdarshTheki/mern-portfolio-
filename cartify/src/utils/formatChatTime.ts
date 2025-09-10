import { format, isToday, isYesterday, isThisYear, parseISO } from 'date-fns';

export function formatChatTime(date: Date) {
  // Convert to Date object if it's a string
  const d = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(d)) {
    return format(d, 'p'); // e.g., 2:45 PM
  } else if (isYesterday(d)) {
    return 'Yesterday';
  } else if (isThisYear(d)) {
    return format(d, 'dd/MM'); // e.g., 12/06
  } else {
    return format(d, 'dd/MM/yyyy'); // e.g., 12/06/2023
  }
}
