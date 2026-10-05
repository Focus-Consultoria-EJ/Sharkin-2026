import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  type SubmitEvent,
} from 'react';
import { flushSync } from 'react-dom';
import { Link, useNavigate } from 'react-router';

import { AuthButton } from '@/components/auth/AuthButton';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { usePasswordRecovery } from '@/contexts/PasswordRecoveryContext';

import {
  requestRecoveryCode,
  verifyRecoveryCode,
  recoveryErrorMessage,
} from '@/api/passwordRecovery';

const CODE_LENGTH = 6;

export function VerificationCodePage() {
  const navigate = useNavigate();

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    email,
    goToNewPassword,
    returnToEmail,
  } = usePasswordRecovery();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  function handleCodeChange(
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const input = event.currentTarget;
    const digit = input.value.replace(/\D/g, '').slice(-1);

    input.value = digit;

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleCodeKeyDown(
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      event.key === 'Backspace' &&
      !event.currentTarget.value &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleCodePaste(
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) {
    event.preventDefault();

    const digits = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, CODE_LENGTH);

    if (!digits) return;

    const startIndex =
      digits.length === CODE_LENGTH ? 0 : index;

    const availableDigits = digits.slice(
      0,
      CODE_LENGTH - startIndex,
    );

    availableDigits.split('').forEach((digit, digitIndex) => {
      const input = inputRefs.current[startIndex + digitIndex];

      if (input) {
        input.value = digit;
      }
    });

    const nextIndex = Math.min(
      startIndex + availableDigits.length,
      CODE_LENGTH - 1,
    );

    inputRefs.current[nextIndex]?.focus();
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (busy) return;

    setError('');
    setNotice('');

    const code = Array.from(
      { length: CODE_LENGTH },
      (_, index) => inputRefs.current[index]?.value ?? '',
    ).join('');

    if (!/^\d{6}$/.test(code)) {
      setError('Informe os 6 dígitos do código.');
      return;
    }

    setBusy(true);

    try {
      const { valid } = await verifyRecoveryCode(email, code);

      if (!valid) {
        setError('Código inválido ou expirado.');
        return;
      }

      flushSync(() => goToNewPassword(code));
      navigate('/redefinir-senha');
    } catch (error) {
      setError(recoveryErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    if (busy || secondsRemaining > 0) return;

    setBusy(true);
    setError('');
    setNotice('');

    try {
      const { message } = await requestRecoveryCode(email);

      setSecondsRemaining(60);
      setNotice(message);

      inputRefs.current.forEach((input) => {
        if (input) input.value = '';
      });
    } catch (error) {
      setError(recoveryErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Insira o código"
      subtitle="Se o e-mail estiver cadastrado, você receberá um código de segurança de 6 dígitos."
      accent="forward"
    >
      <form
        className="auth-form auth-form--verification"
        onSubmit={handleSubmit}
        noValidate
      >
        <Link
          className="verification-back-link"
          to="/recuperar-senha"
          onClick={returnToEmail}
        >
          <span aria-hidden="true">‹</span>
          Voltar
        </Link>

        <div
          className="verification-code"
          role="group"
          aria-label="Código de segurança de 6 dígitos"
        >
          {Array.from({ length: CODE_LENGTH }, (_, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              className="verification-code__input"
              id={`verification-code-${index + 1}`}
              name={`verification-code-${index + 1}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
              maxLength={1}
              required
              disabled={busy}
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              aria-label={`Dígito ${index + 1} de ${CODE_LENGTH}`}
              onChange={(event) =>
                handleCodeChange(index, event)
              }
              onKeyDown={(event) =>
                handleCodeKeyDown(index, event)
              }
              onPaste={(event) =>
                handleCodePaste(index, event)
              }
              onFocus={(event) => event.currentTarget.select()}
            />
          ))}
        </div>

        {error && (
          <p className="auth-field__error" role="alert">
            {error}
          </p>
        )}

        {notice && <p role="status">{notice}</p>}

        <AuthButton disabled={busy}>
          {busy ? 'Aguarde...' : 'Continuar'}
        </AuthButton>

        <button
          className="verification-resend"
          type="button"
          disabled={busy || secondsRemaining > 0}
          onClick={handleResend}
        >
          {secondsRemaining > 0
            ? `Reenviar código em ${secondsRemaining} s`
            : 'Reenviar código'}
        </button>
      </form>
    </AuthLayout>
  );
}