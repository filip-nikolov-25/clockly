import type { TimeOff } from "./interfaces/types";
// 28 Jan 2026
export const formatDateDisplay = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// 2026-01-28
export const formatDateToISO = (date: string | Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 14:35
export const formatTimeDisplay = (date: string | Date) => {
  const d = new Date(date);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

// 8:30 h
export const formatMinutesToTime = (minutes?: string | number) => {
  const mins = Number(minutes || 0);
  const h = Math.floor(mins / 60);
  const m = mins % 60;

  return `${h}:${String(m).padStart(2, "0")} h`;
};

// 2026-01-28 -- LOCAL, timezone-safe
export const toLocalISODate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-CA");

export const getBreakMinutes = (
  breakStart?: string | null,
  breakEnd?: string | null,
) => {
  if (!breakStart || !breakEnd) return 0;

  const start = new Date(breakStart).getTime();
  const end = new Date(breakEnd).getTime();

  if (isNaN(start) || isNaN(end) || end <= start) return 0;

  return Math.round((end - start) / 60000);
};

export const convertMonSunWeekDaysFormat = (date: Date) => {
  const d = new Date(date);
  let day = d.getDay();
  day = day === 0 ? 6 : day - 1;

  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const formatMinutesToHoursAndMinutes = (minutes?: string | number) => {
  const mins = Number(minutes || 0);
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};
export const countWorkingDaysInWeek = (startDate: string, endDate: string) => {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

export const toDateKey = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
};


  export const formatLeavesToDays = (leaves: TimeOff[] = []) => {
    const days: Record<string, string> = {};
    leaves.forEach((leave) => {
      if (!leave.start_date || !leave.end_date) return;
      let current = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      while (current <= end) {
        days[toDateKey(current)] = leave.leave_type;
        current.setDate(current.getDate() + 1);
      }
    });
    return days;
  };

