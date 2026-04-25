import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import Wrapper from "../components/base/Wrapper";
import WeekCalendar from "../components/WeekCalendar";
import TimeOffRequestForm from "../components/TimeOffRequestForm";
import axios from "axios";
import type { PublicHolidayType, UserType } from "../interfaces/types";

interface Props {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

const CalendarPage = ({ user, setUser }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [weekView, setWeekView] = useState(false);
  const [publicHolidays, setPublicHolidays] = useState<PublicHolidayType[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const countries = ["CH", "DE", "MK"];
  const year = new Date().getFullYear();
  useEffect(() => {
    const fetchPublicHolidays = async () => {
      try {
        const requests = countries.map((c) =>
          axios.get(`${API_URL}/api/public-holidays`, {
            params: {
              country_code: c,
              start_date: `${year}-01-01`,
              end_date: `${year}-12-31`,
            },
          }),
        );

        const responses = await Promise.all(requests);

        const merged = responses.flatMap((res) =>
          res.data.map((holiday: any) => ({
            date: holiday.date,
            localName: holiday.local_name,
            countryCode: holiday.country_code,
          })),
        );

        setPublicHolidays(merged);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };

    fetchPublicHolidays();
  }, []);

  return (
    <Wrapper>
      <header className="text-4xl sm:text-5xl md:text-6xl mt-8 sm:mt-14 font-extrabold text-white">
        Calendar
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6 mt-6">
        <div className="flex items-center space-x-3">
          <span
            className={`text-sm sm:text-base text-gray-300 font-semibold ${
              !weekView ? "text-orange-400" : ""
            }`}
          >
            Month View
          </span>
          <button
            onClick={() => setWeekView(!weekView)}
            className={`w-12 h-7 sm:w-14 sm:h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              weekView ? "bg-gray-600" : "bg-orange-500"
            }`}
          >
            <div
              className={`bg-white w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                weekView ? "translate-x-5 sm:translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm sm:text-base text-gray-300 ${
              weekView ? "text-orange-400" : ""
            } font-semibold`}
          >
            Week View
          </span>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="w-full sm:w-auto px-6 sm:px-8 py-2 border-2 border-orange-400 text-orange-500 font-semibold rounded-lg hover:bg-orange-400 hover:text-white transition-colors duration-200"
        >
          Request Time Off
        </button>
      </div>

      {showRequestModal && (
        <TimeOffRequestForm
          onClose={() => setShowRequestModal(false)}
          onSubmitted={() => setShowRequestModal(false)}
          user={user}
          setUser={setUser}
        />
      )}

      <div className="overflow-x-auto">
        {weekView ? (
          <WeekCalendar publicHolidays={publicHolidays} />
        ) : (
          <Calendar publicHolidays={publicHolidays} />
        )}
      </div>
    </Wrapper>
  );
};

export default CalendarPage;