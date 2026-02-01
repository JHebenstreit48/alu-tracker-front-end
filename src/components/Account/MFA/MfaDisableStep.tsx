import { useState } from "react";

type Props = {
  onDisable: (proof: string) => Promise<void>;
};

export default function MfaDisableStep({ onDisable }: Props) {
  const [proof, setProof] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const v = proof.trim();
    if (!v || busy) return;

    setBusy(true);
    try {
      await onDisable(v);
      setProof("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ marginTop: ".75rem" }}>
      <div className="AccountHint" style={{ marginBottom: ".35rem" }}>
        Enter a 6-digit authenticator code or a recovery code to disable 2FA.
      </div>

      <input
        placeholder="6-digit code or recovery code"
        value={proof}
        onChange={(e) => setProof(e.target.value)}
      />

      <button
        onClick={submit}
        style={{ marginLeft: ".5rem" }}
        type="button"
        disabled={busy}
      >
        {busy ? "Disabling..." : "Disable 2FA"}
      </button>
    </div>
  );
}