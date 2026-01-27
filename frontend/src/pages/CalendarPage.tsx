import React from "react";
import Calendar from "../components/Calendar";
import Wrapper from "../components/base/Wrapper";
import WeekCalendar from "../components/WeekCalendar";

const CalendarPage = () => {
  const [weekView, setWeekView] = React.useState(false);

  return (
    <Wrapper>
      <button
        className="bg-white text-black"
        onClick={() => setWeekView(!weekView)}
      >
        Week view
      </button>
      {weekView ? <Calendar /> : <WeekCalendar />}
    </Wrapper>
  );
};

export default CalendarPage;
