import type { SubmitEvent } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";

import eyeIcon from "@/assets/symbols/eye.png";
import eyeOffIcon from "@/assets/symbols/eye_off.png";
import lockIcon from "@/assets/symbols/lock.png";

export function ResetPasswordPage() {
  function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
  }

  return (
    <AuthLayout
      title="Redefinir senha"
      subtitle="Digite sua nova senha."
      accent="forward"
    >
      <form
        className="auth-form auth-form--reset"
        onSubmit={handleSubmit}
      >
        <AuthField
          id="new-password"
          type="password"
          icon={lockIcon}
          showPasswordIcon={eyeIcon}
          hidePasswordIcon={eyeOffIcon}
          placeholder="senha"
          autoComplete="new-password"
        />

        <AuthField
          id="confirm-new-password"
          type="password"
          icon={lockIcon}
          showPasswordIcon={eyeIcon}
          hidePasswordIcon={eyeOffIcon}
          placeholder="confirmar senha"
          autoComplete="new-password"
        />

        <AuthButton>Redefinir</AuthButton>
      </form>
    </AuthLayout>
  );
}