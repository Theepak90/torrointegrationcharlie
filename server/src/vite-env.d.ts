/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add more environment variable type definitions here
  // readonly VITE_APP_TITLE: string
  // readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
