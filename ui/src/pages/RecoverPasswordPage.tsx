import type { SubmitEvent } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";

import mailIcon from "@/assets/symbols/mail.png";

export function RecoverPasswordPage() {
  function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
  }

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Informe um email que você tenha acesso e enviaremos um link para recuperação da sua senha."
      accent="forward"
    >
      <form
        className="auth-form auth-form--recover"
        onSubmit={handleSubmit}
      >
        <AuthField
          id="recovery-email"
          type="email"
          icon={mailIcon}
          placeholder="e-mail para recuperação"
          autoComplete="email"
        />

        <AuthButton>Enviar</AuthButton>
      </form>
    </AuthLayout>
  );
}