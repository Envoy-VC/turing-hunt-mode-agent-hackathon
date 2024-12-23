/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REOWN_PROJECT_ID: string;
  readonly VITE_CONVEX_URL: string;
  readonly VITE_PUBLIC_ADMIN_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
