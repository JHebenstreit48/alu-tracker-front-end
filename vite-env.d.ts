/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COMMENTS_API_BASE_URL: string;
  // add others here as you introduce them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}