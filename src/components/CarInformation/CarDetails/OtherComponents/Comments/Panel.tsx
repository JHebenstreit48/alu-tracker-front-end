// src/components/CarInformation/CarDetails/OtherComponents/Comments/Panel.tsx
import { useAuth } from "@/components/SignupLogin/hooks/useAuth";
import "@/scss/Cars/CarDetails/CarComments.scss";

import CommentForm from "@/components/CarInformation/CarDetails/OtherComponents/Comments/CommentForm";
import CommentsList from "@/components/CarInformation/CarDetails/OtherComponents/Comments/CommentsList";
import { useComments } from "@/components/CarInformation/CarDetails/OtherComponents/Comments/useComments";
import type { PanelProps } from "@/components/CarInformation/CarDetails/OtherComponents/Comments/types";

export default function Panel(props: PanelProps) {
  const auth = useAuth?.();
  const {
    loading,
    error,
    filtered,
    setFilter,
    submit,
    admin,
    saveSelfLocal,
    deleteSelfLocal,
  } = useComments(props, auth ?? { token: null });

  const adminKey = sessionStorage.getItem("commentsAdminKey") || "";
  const canModerate = adminKey.length > 0;

  return (
    <>
      {/* keeps: comments-panel, comments-title, comments-form, row, grid, col, char-count, success, submit, hp */}
      <CommentForm
        token={auth?.token ?? null}
        username={auth?.username}
        onSubmit={async (...args) => {
          await submit(...args);
        }}
      />

      {error && <div className="error" style={{ marginTop: ".5rem" }}>{error}</div>}

      {/* keeps: comments-section, comments-title, comments-filters, chip, comments-list, info */}
      <CommentsList
        loading={loading}
        items={filtered}
        /* IMPORTANT: use hook's filter state via setFilter;
           CommentsList owns the current value internally via its props (it renders the active chip).
           If you also want the current value in Panel in the future, expose `filter` from the hook and pass it here. */
        filter={"all"}
        setFilter={setFilter}
        canModerate={canModerate}
        onApprove={(id) => admin("PATCH", id, adminKey, "visible")}
        onHide={(id) => admin("PATCH", id, adminKey, "hide")}
        onDelete={(id) => admin("DELETE", id, adminKey)}
        onSaveSelf={saveSelfLocal}
        onDeleteSelf={deleteSelfLocal}
      />
    </>
  );
}