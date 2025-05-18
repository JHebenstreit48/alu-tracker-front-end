import { useEffect } from "react";
import { Car } from "@/components/CarInformation/CarDetails/Miscellaneous/CarInterfaces";
import {
  getCarTrackingData,
  setCarTrackingData,
  generateCarKey
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
  useEffect(() => {
    if (trackerMode && car.KeyCar) {
      const carKey = generateCarKey(car.Brand, car.Model);
      const prevData = getCarTrackingData(carKey);
      setCarTrackingData(carKey, {
        ...prevData,
        keyObtained,
      });
    }
  }, [trackerMode, car.Brand, car.Model, car.KeyCar, keyObtained]);

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
