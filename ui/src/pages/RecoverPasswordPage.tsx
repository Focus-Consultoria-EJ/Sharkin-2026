import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { usePasswordRecovery } from "@/contexts/PasswordRecoveryContext";

import mailIcon from "@/assets/symbols/mail.png";

type RecoveryFormData = {
  email: string;
};

export function RecoverPasswordPage() {
  const navigate = useNavigate();
  const { goToCode } = usePasswordRecovery();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoveryFormData>({
    mode: "onBlur",
  });

  function onSubmit() {
    flushSync(() => goToCode());
    navigate("/verificar-codigo");
  }

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Informe seu e-mail e enviaremos um código para recuperação da sua senha."
      accent="forward"
    >
      <form
        className="auth-form auth-form--recover"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <AuthField
          id="recovery-email"
          type="email"
          icon={mailIcon}
          placeholder="e-mail para recuperação"
          autoComplete="email"
          registration={register("email", {
            required: "Informe o e-mail.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Informe um e-mail válido.",
            },
          })}
          error={errors.email?.message}
        />

        <AuthButton>Enviar</AuthButton>
      </form>
    </AuthLayout>
  );
}
