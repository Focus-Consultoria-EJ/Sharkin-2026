import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

export type PasswordRecoveryStep =
  | 'idle'
  | 'email'
  | 'code'
  | 'password';

type PasswordRecoveryContextValue = {
  step: PasswordRecoveryStep;
  email: string;
  code: string;
  startRecovery: () => void;
  goToCode: (email: string) => void;
  returnToEmail: () => void;
  goToNewPassword: (code: string) => void;
  finishRecovery: () => void;
};

const PasswordRecoveryContext =
  createContext<PasswordRecoveryContextValue | null>(null);

export function PasswordRecoveryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [step, setStep] =
    useState<PasswordRecoveryStep>('idle');

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  function startRecovery() {
    setEmail('');
    setCode('');
    setStep('email');
  }

  function goToCode(recoveryEmail: string) {
    setEmail(recoveryEmail);
    setCode('');
    setStep('code');
  }

  function returnToEmail() {
    setCode('');
    setStep('email');
  }

  function goToNewPassword(verifiedCode: string) {
    setCode(verifiedCode);
    setStep('password');
  }

  function finishRecovery() {
    setEmail('');
    setCode('');
    setStep('idle');
  }

  return (
    <PasswordRecoveryContext.Provider
      value={{
        step,
        email,
        code,
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
      'usePasswordRecovery deve ser usado dentro de PasswordRecoveryProvider',
    );
  }

  return context;
}