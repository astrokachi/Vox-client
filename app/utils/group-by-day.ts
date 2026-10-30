import { daysAgo } from "./format-date";

export interface DayGroup<T> {
  label: string;
  items: T[];
}

// "Today", "Yesterday", "Previous 7 days", then one group per month
// ("October", or "October 2025" outside this year).
const groupLabel = (date: Date, now: Date): string => {
  const days = daysAgo(date, now);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return "Previous 7 days";
  return date.toLocaleDateString(undefined, {
    month: "long",
    ...(date.getFullYear() === now.getFullYear() ? {} : { year: "numeric" }),
  });
};

// Buckets an already newest-first list into day groups, keeping its order.
// Items with an unreadable date go into an "Earlier" group.
export const groupByDay = <T>(
  items: T[],
  getDate: (item: T) => string,
  now = new Date(),
): DayGroup<T>[] => {
  const groups: DayGroup<T>[] = [];
  for (const item of items) {
    const date = new Date(getDate(item));
    const label = Number.isNaN(date.getTime()) ? "Earlier" : groupLabel(date, now);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
};
