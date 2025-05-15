import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Car } from "@/components/CarInformation/CarDetails/Miscellaneous/CarInterfaces";
import CarImage from "@/components/CarInformation/CarDetails/OtherComponents/CarImage";
import ClassRank from "@/components/CarInformation/CarDetails/Tables/ClassRank";
import MaxStats from "@/components/CarInformation/CarDetails/Tables/MaxStats";
import BlueprintsTable from "@/components/CarInformation/CarDetails/Tables/BlueprintsTable";
import "@/SCSS/Cars/CarDetail.scss";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState(false);

  const trackerMode = location.state?.trackerMode || false;

  const unitPreference =
    localStorage.getItem("preferredUnit") === "imperial"
      ? "imperial"
      : "metric";

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "https://alutracker-api.onrender.com";

  useEffect(() => {
    function fetchCarDetails(carId: string) {
      fetch(`${API_BASE_URL}/api/cars/detail/${carId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setCar(data))
        .catch(() => setError(true));
    }

    if (id) {
      fetchCarDetails(id);
    }
  }, [id, API_BASE_URL]);

  const handleGoBack = () => {
    const lastSelectedClass = location.state?.selectedClass;
    const trackerState = trackerMode ? { trackerMode: true } : {};
    navigate(lastSelectedClass ? `/cars?class=${lastSelectedClass}` : "/cars", {
      state: trackerState,
    });
  };

  if (error)
    return <div className="error-message">Failed to load car details.</div>;
  if (!car)
    return <div className="loading-message">Loading car details...</div>;

  return (
    <div className="car-detail">
      <div>
        <button className="backBtn" onClick={handleGoBack}>
          Back
        </button>
      </div>

      <div>
        <h1 className="carName">
          {car.Brand} {car.Model}
        </h1>
      </div>

      <CarImage car={car} />

      <div className="carDetailTables">
        <ClassRank car={car} trackerMode={trackerMode} />
        <MaxStats
          car={car}
          unitPreference={unitPreference}
          trackerMode={trackerMode}
        />
      </div>

      <BlueprintsTable car={car} trackerMode={trackerMode} />
    </div>
  );
};

export default CarDetails;
