/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION?: string;
  readonly VITE_PASSWORD_MIN_LENGTH?: string;
  readonly VITE_PUBLIC_REGISTRATION_ENABLED?: string;
  readonly VITE_USE_MOCK?: string;
}
