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
  breakEnd?: string | null
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

