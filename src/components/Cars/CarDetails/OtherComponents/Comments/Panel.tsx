import { useAuth } from "@/hooks/SignupLogin/useAuth";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import { useComments } from "./useComments";
import type { PanelProps } from "@/interfaces/Comments";

export default function Panel(props: PanelProps) {
  const auth = useAuth?.();

  const {
    loading,
    error,
    filtered,
    filter,
    setFilter,
    submit,
    admin,
    saveSelfLocal,
    deleteSelfLocal,
  } = useComments(props, auth ?? { token: null });

  const adminKey =
    typeof window !== "undefined"
      ? sessionStorage.getItem("commentsAdminKey") || ""
      : "";
  const canModerate = adminKey.length > 0;

  return (
    <>
      <CommentForm
        token={auth?.token ?? null}
        username={auth?.username}
        onSubmit={submit}
      />

      {error && (
        <div className="error" style={{ marginTop: ".5rem" }}>
          {error}
        </div>
      )}

      <CommentsList
        loading={loading}
        items={filtered}
        filter={filter}
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