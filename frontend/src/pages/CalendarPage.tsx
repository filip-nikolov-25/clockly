import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import Wrapper from "../components/base/Wrapper";
import WeekCalendar from "../components/WeekCalendar";
import TimeOffRequestForm from "../components/TimeOffRequestForm";
import axios from "axios";
import type { PublicHolidayType } from "../interfaces/types";

const CalendarPage = () => {
  const [weekView, setWeekView] = useState(false);
  const [publicHolidays, setPublicHolidays] = useState<PublicHolidayType[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const countries = ["CH", "DE", "MK"];
  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchPublicHolidays = async () => {
      try {
        const requests = countries.map((c) =>
          axios.get(
            `https://date.nager.at/api/v3/PublicHolidays/${year}/${c}`,
            { withCredentials: false }
          )
        );
        const responses = await Promise.all(requests);
        const merged = responses.flatMap((r) => r.data);
        setPublicHolidays(merged);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPublicHolidays();
  }, []);

  return (
    <Wrapper>
      <header className="text-6xl mt-14 font-extrabold text-white">Calendar</header>

      <div className="flex justify-between items-center mb-6 mt-6">
        <div className="flex items-center space-x-3">
          <span className="text-gray-300 font-semibold">Month View</span>
          <button
            onClick={() => setWeekView(!weekView)}
            className={`w-14 h-8 flex items-center bg-gray-600 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              weekView ? "bg-gray-600" : "bg-orange-500"
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                weekView ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-gray-300 font-semibold">Week View</span>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="px-8 py-2 border-2 border-orange-400 text-orange-500 font-semibold rounded-lg hover:bg-orange-400 hover:text-white transition-colors duration-200"
        >
          Request Time Off
        </button>
      </div>

      {showRequestModal && (
        <TimeOffRequestForm
          onClose={() => setShowRequestModal(false)}
          onSubmitted={() => setShowRequestModal(false)}
        />
      )}

      {weekView ? (
        <WeekCalendar publicHolidays={publicHolidays} />
      ) : (
        <Calendar publicHolidays={publicHolidays} />
      )}
    </Wrapper>
  );
};

export default CalendarPage;
