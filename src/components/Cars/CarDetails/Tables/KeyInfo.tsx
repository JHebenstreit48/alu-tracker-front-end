import { Car } from "@/components/Cars/CarDetails/Miscellaneous/Interfaces";
import {
  setKeyObtainedState,   // <- keep
  generateCarKey,        // <- keep
} from "@/components/Cars/CarDetails/Miscellaneous/StorageUtils";
import { useAutoSyncDependency } from "@/components/UserDataSync/hooks/useAutoSync";

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
  onKeyObtainedChange,
}) => {
  const carKey = generateCarKey(car.Brand, car.Model);

  // Autosync still reacts to the controlled prop change
  useAutoSyncDependency(trackerMode && car.KeyCar ? [keyObtained] : []);

  if (!car.KeyCar) return null;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    // Persist with final rules (doesn't touch stars)
    setKeyObtainedState(carKey, isChecked);

    // Let parent update its controlled state
    onKeyObtainedChange?.(isChecked);
  };

  return (
    <div className="keyInfoTableContainer">
      <table className="keyInfoTable">
        <thead>
          <tr>
            <th className="tableHeader2">Special Tags</th>
          </tr>
        </thead>
        <tbody className="testClass">
          <tr>
            <td className="testClass">🔑 <strong>Key Car</strong></td>
          </tr>
          {trackerMode && (
            <tr>
              <td className="testClass">
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