import { Car } from "@/types/shared/car";
import { setKeyObtainedState, generateCarKey } from "@/utils/shared/StorageUtils";
import { useAutoSyncDependency } from "@/hooks/UserDataSync/useAutoSync";

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
  const carKey = generateCarKey(car.brand, car.model);

  useAutoSyncDependency(trackerMode && car.keyCar ? [keyObtained] : []);

  if (!car.keyCar) return null;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setKeyObtainedState(carKey, isChecked);
    onKeyObtainedChange?.(isChecked);
  };

  return (
    <div className="keyInfoTableContainer">
      <table className="keyInfoTable">
        <tbody>
          <tr>
            <td className="keyInfoCell">🔑 <strong>Key Car</strong></td>
          </tr>

          {trackerMode && (
            <tr>
              <td className="keyObtainedCheckbox">
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