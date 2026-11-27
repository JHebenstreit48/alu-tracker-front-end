import React, { useEffect, useRef, useState } from 'react';

type Props = {
  isFixing: boolean;
  onChange: (next: boolean) => void;
  // true = confirmation pop-up before unlocking, false = plain toggle
  confirmBeforeEditing: boolean;
};

const BlueprintsFixControl: React.FC<Props> = ({ isFixing, onChange, confirmBeforeEditing }) => {
  const [askOpen, setAskOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Native <dialog> gives the backdrop, focus trap and Escape-to-close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (askOpen && !dialog.open) dialog.showModal();
    if (!askOpen && dialog.open) dialog.close();
  }, [askOpen]);

  const handleClick = () => {
    if (isFixing) {
      onChange(false);
    } else if (confirmBeforeEditing) {
      setAskOpen(true);
    } else {
      onChange(true);
    }
  };

  const confirmEdit = () => {
    setAskOpen(false);
    onChange(true);
  };

  return (
    <>
      <button
        type="button"
        className="blueprintFixButton"
        onClick={handleClick}
        aria-pressed={isFixing}
      >
        {isFixing ? 'Done' : 'Fix a mistake'}
      </button>

      {confirmBeforeEditing && (
        <dialog ref={dialogRef} className="blueprintFixDialog" onClose={() => setAskOpen(false)}>
          <p>Edit completed blueprints?</p>
          <p>Lowering a completed star below its requirement removes that star from this car.</p>
          <div className="blueprintFixDialogActions">
            <button type="button" onClick={() => setAskOpen(false)}>
              Cancel
            </button>
            <button type="button" onClick={confirmEdit}>
              Edit
            </button>
          </div>
        </dialog>
      )}
    </>
  );
};

export default BlueprintsFixControl;