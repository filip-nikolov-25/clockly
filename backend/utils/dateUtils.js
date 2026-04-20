export const formatDateLocal = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const calculateWorkingDays = (start, end, holidayDates) => {
  let count = 0;
  let current = new Date(start);

  const holidaySet = new Set(holidayDates);
  while (current <= new Date(end)) {
    const day = current.getDay();
    const formatted = formatDateLocal(current);
    const isWeekend = day === 0 || day === 6;
    const isHoliday = holidaySet.has(formatted);

    if (!isWeekend && !isHoliday) {
      count++;
    }

    current.setDate(current.getDate() + 1);
  }

  return count;
};
