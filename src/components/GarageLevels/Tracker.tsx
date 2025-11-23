import React, { useState, useEffect } from "react";
import type { GarageLevelsInterface } from "@/interfaces/GarageLevels";
import "@/scss/GarageLevels/Tracker.scss";

interface GarageLevelTrackerProps {
  levels: GarageLevelsInterface[];
}

const GarageLevelTracker: React.FC<GarageLevelTrackerProps> = ({ levels }) => {
  const [currentLevel, setCurrentLevel] = useState(() => {
    return Number(localStorage.getItem("currentGarageLevel")) || 1;
  });

  const [currentXp, setCurrentXp] = useState(() => {
    return localStorage.getItem("currentXp") || "";
  });

  useEffect(() => {
    localStorage.setItem("currentGarageLevel", currentLevel.toString());
  }, [currentLevel]);

  useEffect(() => {
    localStorage.setItem("currentXp", currentXp);
  }, [currentXp]);

  const nextLevelData = levels.find(
    (level) => level.GarageLevelKey === currentLevel + 1
  );
  const nextXpRequired = nextLevelData?.xp || 0;

  const xpRemaining =
    nextXpRequired > 0
      ? Math.max(
          nextXpRequired - Number(currentXp.replace(/,/g, "")),
          0
        )
      : 0;

  const handleXpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(value)) {
      const formattedValue =
        value === "" ? "" : Number(value).toLocaleString("en-US");
      setCurrentXp(formattedValue);
    }
  };

  return (
    <div className="garageLevelTracker">
      <div className="levelSelector">
        <label>
          Select Current Garage Level:
          <select
            value={currentLevel}
            onChange={(e) => setCurrentLevel(Number(e.target.value))}
          >
            {levels.map((level) => (
              <option
                key={level.GarageLevelKey}
                value={level.GarageLevelKey}
              >
                Garage Level {level.GarageLevelKey}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="xpInputSection">
        <label>
          Enter Current XP:
          <input
            type="text"
            value={currentXp}
            onChange={handleXpChange}
            placeholder="0"
          />
        </label>
      </div>

      <div className="xpRemaining">
        <label>
          XP to Next Level:{" "}
          <strong>
            {xpRemaining > 0
              ? xpRemaining.toLocaleString("en-US")
              : "0"}
          </strong>
        </label>
      </div>
    </div>
  );
};

export default GarageLevelTracker;