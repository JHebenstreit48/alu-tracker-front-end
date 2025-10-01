// Kill switch: ?nocomments=1 or ?nofeedback=1 (also honored in #hash)
export const DISABLE_COMMENTS =
  typeof window !== "undefined" &&
  (() => {
    const qs = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return qs.has("nocomments") || qs.has("nofeedback") || hash.has("nocomments") || hash.has("nofeedback");
  })();