import { useEffect } from "react";
import { Car } from "@/components/CarInformation/CarDetails/Miscellaneous/CarInterfaces";
import {
  getCarTrackingData,
  setCarTrackingData
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

interface KeyInfoProps {
  car: Car;
  trackerMode?: boolean;
  keyObtained?: boolean;
  onKeyObtainedChange?: (obtained: boolean) => void;
}

const KeyInfo: React.FC<KeyInfoProps> = ({
  car,
  trackerMode = false,
  keyObtained = false,
  onKeyObtainedChange
}) => {
  // ✅ Hook must be top-level, so we wrap the logic inside instead
  useEffect(() => {
    if (trackerMode && car._id && car.KeyCar) {
      const prevData = getCarTrackingData(car._id);
      setCarTrackingData(car._id, {
        ...prevData,
        keyObtained, // ✅ Will only exist in storage if trackerMode is on and this is a KeyCar
      });
    }
  }, [trackerMode, car._id, car.KeyCar, keyObtained]);

  // ✅ Early return (but only AFTER the hook above!)
  if (!car.KeyCar) return null;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    if (onKeyObtainedChange) onKeyObtainedChange(isChecked);
  };

  return (
    <div className="keyInfoTableContainer">
      <table className="keyInfoTable">
        <thead>
          <tr>
            <th className="tableHeader2">Special Tags</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>🔑 <strong>Key Car</strong></td>
          </tr>
          {trackerMode && (
            <tr>
              <td>
                <label>
                  <input
                    type="checkbox"
                    checked={keyObtained}
                    onChange={handleCheckboxChange}
                  />{" "}
                  Key Obtained
                </label>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default KeyInfo;
