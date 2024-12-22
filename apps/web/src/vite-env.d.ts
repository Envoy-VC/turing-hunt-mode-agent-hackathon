/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CROSSMINT_API_KEY: string;
  readonly VITE_CONVEX_URL: string;
  readonly VITE_PUBLIC_ADMIN_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
