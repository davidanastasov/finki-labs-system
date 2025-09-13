import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

export function formatDate(date: Date) {
  return format(date, "dd.MM.yyyy");
}

export function formatDateRange(dateRange: DateRange | undefined): string {
  if (!dateRange?.from) {
    return "";
  }

  if (!dateRange.to) {
    return format(dateRange.from, "dd.MM.yyyy");
  }

  return `${format(dateRange.from, "dd.MM.yyyy")} - ${format(dateRange.to, "dd.MM.yyyy")}`;
}
