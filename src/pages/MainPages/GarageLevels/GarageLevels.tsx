import { useState, useEffect } from "react";
import Header from "@/components/Shared/Header";
import PageTab from "@/components/Shared/PageTab";
import GarageLevelsDropDown from "@/components/GarageLevels/GarageLevelsDropDown";
import GLTrackerToggle from "@/components/GarageLevels/GLTrackerToggle";
import GarageLevelTracker from "@/components/GarageLevels/GarageLevelTracker";
import { GarageLevelsInterface } from "@/components/GarageLevels/interface";
import "@/scss/GarageLevels/GarageLevelTracker.scss";
import "@/scss/GarageLevels/GarageLevels.scss";

// ✅ Pull from environment just like on Cars page
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://alutracker-api.onrender.com";

export default function GarageLevelsPage() {
  const [garageLevels, setGarageLevels] = useState<GarageLevelsInterface[]>([]);
  const [isTrackerMode, setIsTrackerMode] = useState(() => {
    return localStorage.getItem("garageLevelTrackerMode") === "true";
  });

useEffect(() => {
  const fetchGarageLevels = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/garage-levels`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: GarageLevelsInterface[] = await res.json();

      // ✅ Sort by GarageLevelKey before saving
      const sorted = data.sort((a, b) => a.GarageLevelKey - b.GarageLevelKey);
      setGarageLevels(sorted);
    } catch (err) {
      console.error("❌ Failed to fetch garage level data:", err);
    }
  };

  fetchGarageLevels();
}, []);


  return (
    <div>
      <PageTab title="Garage Levels">
        <Header text="Garage Levels" className="garageLevelsHeader" />
        <GLTrackerToggle onToggle={setIsTrackerMode} />
        {isTrackerMode && <GarageLevelTracker levels={garageLevels} />}
        <GarageLevelsDropDown levels={garageLevels} />
      </PageTab>
    </div>
  );
}
