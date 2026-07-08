export const PASSWORD_MIN_LENGTH = Number(import.meta.env.VITE_PASSWORD_MIN_LENGTH || 10);

export const isPublicRegistrationEnabled = (): boolean => {
  const configured = import.meta.env.VITE_PUBLIC_REGISTRATION_ENABLED;
  if (configured !== undefined) {
    return configured === 'true';
  }

  return import.meta.env.DEV;
};
