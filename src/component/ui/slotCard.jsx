import React, { useState } from "react";

const days = [
  { label: "Fri", date: "18", recommended: true },
  { label: "Sat", date: "19", recommended: false },
  { label: "Sun", date: "20", recommended: false },
];

const timeSlots = [
  { time: "06:30 PM" },
  { time: "07:00 PM" },
  { time: "07:30 PM" },
];

const SlotCard = ({ onSelectSlot }) => {
  const [selectedDay, setSelectedDay] = useState("18");
  const [selectedTime, setSelectedTime] = useState("06:30 PM");

  const handleProceed = () => {
    const selectedDayObj = days.find((day) => day.date === selectedDay);
    onSelectSlot({ day: selectedDayObj, time: selectedTime });
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md mx-auto font-sans transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        When should the professional arrive?
      </h2>

      {/* Schedule for later */}
      <div className="border border-gray-100 rounded-xl p-5 mb-6 bg-gradient-to-br from-gray-50 to-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Schedule for later
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Select your preferred day & time
        </p>

        {/* Day Selector */}
        <div className="flex space-x-4 mb-6">
          {days.map((day) => (
            <button
              key={day.date}
              onClick={() => setSelectedDay(day.date)}
              className={`flex flex-col items-center px-5 py-3 rounded-lg border transition-all duration-300 hover:scale-105 ${
                selectedDay === day.date
                  ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-md"
                  : "border-gray-200 text-gray-800 hover:bg-gray-50"
              }`}
            >
              <span className="text-sm font-semibold">{day.label}</span>
              <span className="text-lg font-bold">{day.date}</span>
              {day.recommended && (
                <span className="text-xs text-yellow-500 mt-1 animate-pulse">
                  ★ Recommended
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Time Slot Selector */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-3">
            Select start time of service
          </h4>
          <div className="flex flex-wrap gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => setSelectedTime(slot.time)}
                className={`px-5 py-2.5 rounded-lg border flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                  selectedTime === slot.time
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-md"
                    : "border-gray-200 text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span className="text-sm font-medium">{slot.time}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handleProceed}
        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default SlotCard;
