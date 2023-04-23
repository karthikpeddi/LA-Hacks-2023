// SpeedMenu.js
import React, { useState } from "react";

const SpeedMenu = ({ onSelectedSpeed }) => {
  const speeds = [0.5, 0.75, 0.9, 1, 1.2];
  const [selectedSpeed, setSelectedSpeed] = useState(1);

  const handleSpeedChange = (target) => {
    setSelectedSpeed(target);
    onSelectedSpeed(target);
  };

  return (
    <div className="flex gap-x-0.5">
      {speeds.map((speed, index) => (
        <button
          key={index}
          className={`text-sm font-semibold w-11 h-8 duration-100 rounded-sm shadow ${
            selectedSpeed === speed
              ? "bg-orange-600 text-white hover:bg-orange-700"
              : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md"
          }`}
          onClick={() => {
            handleSpeedChange(speed);
          }}
        >
          {speed}x
        </button>
      ))}
    </div>
  );
};

export default SpeedMenu;
