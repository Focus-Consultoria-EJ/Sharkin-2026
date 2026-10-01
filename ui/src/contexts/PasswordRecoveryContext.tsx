import { createContext, useContext, useState, type ReactNode } from "react";

export type PasswordRecoveryStep = "idle" | "email" | "code" | "password";

type PasswordRecoveryContextValue = {
  step: PasswordRecoveryStep;
  startRecovery: () => void;
  goToCode: () => void;
  returnToEmail: () => void;
  goToNewPassword: () => void;
  finishRecovery: () => void;
};

type PasswordRecoveryProviderProps = {
  children: ReactNode;
};

const PasswordRecoveryContext =
  createContext<PasswordRecoveryContextValue | null>(null);

export function PasswordRecoveryProvider({
  children,
}: PasswordRecoveryProviderProps) {
  const [step, setStep] = useState<PasswordRecoveryStep>("idle");

  function startRecovery() {
    setStep("email");
  }

  function goToCode() {
    setStep("code");
  }

  function returnToEmail() {
    setStep("email");
  }

  function goToNewPassword() {
    setStep("password");
  }

  function finishRecovery() {
    setStep("idle");
  }

  return (
    <PasswordRecoveryContext.Provider
      value={{
        step,
        startRecovery,
        goToCode,
        returnToEmail,
        goToNewPassword,
        finishRecovery,
      }}
    >
      {children}
    </PasswordRecoveryContext.Provider>
  );
}

export function usePasswordRecovery() {
  const context = useContext(PasswordRecoveryContext);

  if (!context) {
    throw new Error(
      "usePasswordRecovery deve ser usado dentro de PasswordRecoveryProvider",
    );
  }

  return context;
}
