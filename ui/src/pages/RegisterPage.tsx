import type { SubmitEvent } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";

import eyeIcon from "@/assets/symbols/eye.png";
import eyeOffIcon from "@/assets/symbols/eye_off.png";
import lockIcon from "@/assets/symbols/lock.png";
import mailIcon from "@/assets/symbols/mail.png";
import userIcon from "@/assets/symbols/user.png";

export function RegisterPage() {
  function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
  }

  return (
    <AuthLayout
      title="Cadastro"
      size="compact"
      accent="reverse"
    >
      <form
        className="auth-form auth-form--register"
        onSubmit={handleSubmit}
      >
        <AuthField
          id="register-email"
          type="email"
          icon={mailIcon}
          placeholder="e-mail"
          autoComplete="email"
        />

        <AuthField
          id="register-name"
          type="text"
          icon={userIcon}
          placeholder="nome"
          autoComplete="name"
        />

        <AuthField
          id="register-password"
          type="password"
          icon={lockIcon}
          showPasswordIcon={eyeIcon}
          hidePasswordIcon={eyeOffIcon}
          placeholder="senha"
          autoComplete="new-password"
        />

        <AuthField
          id="register-password-confirmation"
          type="password"
          icon={lockIcon}
          showPasswordIcon={eyeIcon}
          hidePasswordIcon={eyeOffIcon}
          placeholder="confirmar senha"
          autoComplete="new-password"
        />

        <AuthButton>Cadastrar</AuthButton>
      </form>
    </AuthLayout>
  );
}