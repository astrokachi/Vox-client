// "Oct 21" for dates in the current year, "Oct 21, 2025" otherwise.
export const formatShortDate = (iso?: string): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

// Calendar days between `date` and `now`: 0 today, 1 yesterday. NaN if invalid.
export const daysAgo = (date: Date, now = new Date()): number =>
  Math.round((startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000);

// A list row's timestamp: "14:20" this day or the last, "Tue" within a week,
// otherwise "Oct 21" (with the year when it isn't this year).
export const formatListStamp = (iso?: string, now = new Date()): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const days = daysAgo(date, now);
  if (days <= 1) {
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  if (days < 7) return date.toLocaleDateString(undefined, { weekday: "short" });
  return formatShortDate(iso);
};

// When something happened, for inline status: "10:42 PM" today,
// "Yesterday 10:42 PM", "Tue 10:42 PM" within a week, otherwise "Oct 21".
export const formatMoment = (iso?: string, now = new Date()): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const days = daysAgo(date, now);
  if (days >= 7) return formatShortDate(iso);

  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (days <= 0) return time;
  if (days === 1) return `Yesterday ${time}`;
  return `${date.toLocaleDateString(undefined, { weekday: "short" })} ${time}`;
};
