import {
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  type SubmitEvent,
} from "react";
import { flushSync } from "react-dom";
import { Link, useNavigate } from "react-router";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { usePasswordRecovery } from "@/contexts/PasswordRecoveryContext";

const CODE_LENGTH = 6;
const SHOULD_VALIDATE_RECOVERY_CODE = false;

export function VerificationCodePage() {
  const navigate = useNavigate();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { goToNewPassword, returnToEmail } = usePasswordRecovery();

  function handleCodeChange(
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const input = event.currentTarget;

    const digit = input.value.replace(/\D/g, "").slice(-1);

    input.value = digit;

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleCodeKeyDown(
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !event.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleCodePaste(
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) {
    event.preventDefault();

    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);

    if (!digits) {
      return;
    }

    /*
     * Um código completo sempre começa no primeiro quadrado.
     * Uma colagem parcial começa no quadrado selecionado.
     */
    const startIndex = digits.length === CODE_LENGTH ? 0 : index;

    const availableDigits = digits.slice(0, CODE_LENGTH - startIndex);

    availableDigits.split("").forEach((digit, digitIndex) => {
      const input = inputRefs.current[startIndex + digitIndex];

      if (input) {
        input.value = digit;
      }
    });

    /*
     * Se ainda existir um quadrado vazio, posiciona o foco nele.
     * Se todos estiverem preenchidos, posiciona no último.
     */
    const nextIndex = Math.min(
      startIndex + availableDigits.length,
      CODE_LENGTH - 1,
    );

    inputRefs.current[nextIndex]?.focus();
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    flushSync(() => goToNewPassword());
    navigate("/redefinir-senha");
  }

  return (
    <AuthLayout
      title="Insira o código"
      subtitle="Digite o código de segurança de 6 dígitos que enviamos para o seu e-mail."
      accent="forward"
    >
      <form
        className="auth-form auth-form--verification"
        onSubmit={handleSubmit}
        noValidate={!SHOULD_VALIDATE_RECOVERY_CODE}
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
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Dígito ${index + 1} de ${CODE_LENGTH}`}
              onChange={(event) => handleCodeChange(index, event)}
              onKeyDown={(event) => handleCodeKeyDown(index, event)}
              onPaste={(event) => handleCodePaste(index, event)}
              onFocus={(event) => event.currentTarget.select()}
            />
          ))}
        </div>

        <AuthButton>Continuar</AuthButton>

        <button className="verification-resend" type="button">
          Reenviar código em 27 s
        </button>
      </form>
    </AuthLayout>
  );
}
