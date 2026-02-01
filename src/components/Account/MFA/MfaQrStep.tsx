import { useState } from "react";

type Props = {
  otpauthUrl: string;
  code: string;
  setCode: (v: string) => void;
  onConfirm: () => Promise<void>;
};

export default function MfaQrStep({ otpauthUrl, code, setCode, onConfirm }: Props) {
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div style={{ marginTop: ".75rem" }}>
        <div style={{ marginBottom: ".4rem" }}>
          <strong>Scan with your authenticator app:</strong>
        </div>

        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
            otpauthUrl
          )}&size=220x220`}
          width={220}
          height={220}
          alt="Scan this QR with your authenticator app"
          style={{ borderRadius: 8 }}
        />

        <div className="AccountHint" style={{ marginTop: ".35rem" }}>
          After scanning, enter the 6-digit code below to finish enabling 2FA.
        </div>
      </div>

      <div style={{ marginTop: ".75rem" }}>
        <input
          placeholder="Enter 6-digit code"
          inputMode="numeric"
          pattern="\d*"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={confirm} style={{ marginLeft: ".5rem" }} type="button" disabled={busy}>
          {busy ? "Confirming..." : "Confirm"}
        </button>
      </div>
    </>
  );
}