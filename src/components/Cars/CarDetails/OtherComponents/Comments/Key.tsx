import { useEffect, useState } from "react";

type Props = { onChange?: (key: string) => void };

export default function CommentKey({ onChange }: Props) {
  const [key, setKey] = useState<string>(() => sessionStorage.getItem("commentsAdminKey") || "");

  useEffect(() => {
    if (key) sessionStorage.setItem("commentsAdminKey", key);
    else sessionStorage.removeItem("commentsAdminKey");
    onChange?.(key);
  }, [key, onChange]);

  return (
    <div
      className="comments-admin"
      style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}
    >
      <label htmlFor="comments-admin-key">Admin key</label>
      <input
        id="comments-admin-key"
        type="password"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Enter COMMENTS_ADMIN_KEY"
        style={{ maxWidth: 260 }}
      />
      {key && (
        <button type="button" onClick={() => setKey("")}>
          Clear
        </button>
      )}
    </div>
  );
}