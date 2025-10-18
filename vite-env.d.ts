/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CARS_API_BASE_URL: string;
  readonly VITE_CONTENT_API_BASE_URL: string;
  readonly VITE_COMMENTS_API_BASE_URL: string;
  readonly VITE_AUTH_API_URL: string;
  readonly VITE_IMG_CDN_BASE: string;
  // add others here as you introduce them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}