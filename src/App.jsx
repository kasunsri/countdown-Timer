import React, { useState, useEffect } from "react";
import backgroundImage from "./assets/pic.jpg";

const App = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [targetDate, setTargetDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive && targetDate) {
      const targetTime = new Date(targetDate).getTime();
      if (isNaN(targetTime)) {
        alert("Invalid date. Please select a valid date and time.");
        setIsActive(false);
        return;
      }
      interval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetTime - now;
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          clearInterval(interval);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setIsActive(false);
          setIsExpired(true);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, targetDate]);

  const handleSetTimer = () => {
    if (!eventName.trim()) {
      alert("Please enter an event name.");
      return;
    }
    if (!targetDate) {
      alert("Please select a valid date and time.");
      return;
    }
    setIsActive(true);
    setIsExpired(false);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setIsExpired(false);
    setTargetDate("");
    setEventName("");
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  };

  const formatDate = (dateString) => {
    if (!dateString || !dateString.includes("T")) return "";
    const [datePart] = dateString.split("T");
    return datePart;
  };

  const formatTime = (dateString) => {
    if (!dateString || !dateString.includes("T")) return "";
    const [, timePart] = dateString.split("T");
    return timePart.slice(0, 5); 
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-gray-800"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover", 
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        
      }}
    >
      <div className="text-center p-8 border-1 rounded-lg shadow-lg backdrop-blur-2xl w-full max-w-3xl h-auto transform transition-all duration-300 hover:scale-105">
        {isExpired && (
          <div className="absolute top-0 left-0 right-0 flex flex-col items-center rounded-4xl justify-center py-4 bg-yellow-500 text-white text-3xl font-bold shadow-md animate-bounce">
            <p>🌠 <span className="text text-red-700">{eventName}</span>  has arrived !!!🌠 </p>
            <button
              onClick={handleResetTimer}
              className="mt-4 px-6 py-3 bg-indigo-600 rounded-xl text-white hover:bg-indigo-400 transition duration-300 transform hover:scale-105"
            >
              Go to Countdown
            </button>
          </div>
        )}
        {!isExpired && (
          <>
            <h1 className="text-4xl font-bold mb-6 animate-pulse text-indigo-800">
              Countdown Timer
            </h1>
            {!isActive && (
              <>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter your event "
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full p-3 rounded-md text-gray-900 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-300 border border-gray-300"
                  />
                </div>
                <div className="mb-6 flex flex-col items-center justify-center space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                    <input
                      type="date"
                      value={formatDate(targetDate)}
                      onChange={(e) =>
                        setTargetDate(`${e.target.value}T${formatTime(targetDate) || "00:00"}`)
                      }
                      className="p-3 rounded-md text-gray-800 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-300 border border-gray-300"
                    />
                    <input
                      type="time"
                      value={formatTime(targetDate) || "00:00"}
                      onChange={(e) =>
                        setTargetDate(`${formatDate(targetDate)}T${e.target.value}`)
                      }
                      className="p-3 rounded-md text-gray-800 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-300 border border-gray-300"
                    />
                  </div>
                  <button
                    onClick={handleSetTimer}
                    className="px-6 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                  >
                    Set Timer
                  </button>
                </div>
              </>
            )}
            {isActive && !isExpired && (
              <div className="mt-6">
                <p className="text-xl mb-4 animate-bounce text-green-950">
                  Counting down to "{eventName}"...
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div
                      key={unit}
                      className="flex flex-col items-center justify-center bg-white/50 p-4 rounded-lg transform transition-all duration-300 hover:scale-110"
                    >
                      <span className="text-3xl font-bold text-indigo-600">{value}</span>
                      <span className="text-sm capitalize text-gray-600">{unit}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleResetTimer}
                  className="mt-6 px-6 py-3 bg-red-300 text-white rounded-md hover:bg-red-400 transition duration-300 transform hover:scale-105"
                >
                  Reset
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;