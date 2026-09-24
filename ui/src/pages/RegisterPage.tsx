import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { sharkinApi } from "@/api/api";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";

import eyeIcon from "@/assets/symbols/eye.png";
import eyeOffIcon from "@/assets/symbols/eye_off.png";
import lockIcon from "@/assets/symbols/lock.png";
import mailIcon from "@/assets/symbols/mail.png";
import userIcon from "@/assets/symbols/user.png";

type RegisterFormData = {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
};

type ApiErrorResponse = {
  message?: string | string[];
};

export function RegisterPage() {
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormData>({
    mode: "onBlur",
  });

  async function onSubmit({
    email,
    name,
    password,
  }: RegisterFormData) {
    setSubmitError(null);

    try {
      await sharkinApi.post("/user", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      if (!axios.isAxiosError<ApiErrorResponse>(error)) {
        setSubmitError(
          "Ocorreu um erro inesperado. Tente novamente.",
        );
        return;
      }

      if (!error.response) {
        setSubmitError(
          "Não foi possível conectar ao servidor.",
        );
        return;
      }

      const apiMessage = error.response.data?.message;

      if (error.response.status === 409) {
        setSubmitError(
          typeof apiMessage === "string"
            ? apiMessage
            : "Este e-mail já está cadastrado.",
        );
        return;
      }

      if (error.response.status === 400) {
        setSubmitError(
          Array.isArray(apiMessage)
            ? apiMessage.join(" ")
            : apiMessage ??
                "Verifique os dados informados.",
        );
        return;
      }

      setSubmitError(
        "Não foi possível realizar o cadastro. Tente novamente.",
      );
    }
  }

  return (
    <AuthLayout
      title="Cadastro"
      size="compact"
      accent="reverse"
    >
      <form
        className="auth-form auth-form--register"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <AuthField
          id="register-email"
          type="email"
          icon={mailIcon}
          placeholder="e-mail"
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

        <AuthField
          id="register-name"
          type="text"
          icon={userIcon}
          placeholder="nome"
          autoComplete="name"
          registration={register("name", {
            required: "Informe o nome.",
            validate: (value) =>
              value.trim().length >= 2 ||
              "O nome deve ter pelo menos 2 caracteres.",
          })}
          error={errors.name?.message}
        />

        <AuthField
          id="register-password"
          type="password"
          icon={lockIcon}
          showPasswordIcon={eyeIcon}
          hidePasswordIcon={eyeOffIcon}
          placeholder="senha"
          autoComplete="new-password"
          registration={register("password", {
            required: "Informe a senha.",
            minLength: {
              value: 8,
              message:
                "A senha deve ter pelo menos 8 caracteres.",
            },
          })}
          error={errors.password?.message}
        />

        <AuthField
          id="register-password-confirmation"
          type="password"
          icon={lockIcon}
          showPasswordIcon={eyeIcon}
          hidePasswordIcon={eyeOffIcon}
          placeholder="confirmar senha"
          autoComplete="new-password"
          registration={register(
            "passwordConfirmation",
            {
              required: "Confirme a senha.",
              validate: (value) =>
                value === getValues("password") ||
                "As senhas não coincidem.",
            },
          )}
          error={errors.passwordConfirmation?.message}
        />

        {submitError && (
          <p
            className="auth-form__error"
            role="alert"
          >
            {submitError}
          </p>
        )}

        <AuthButton disabled={isSubmitting}>
          {isSubmitting
            ? "Cadastrando..."
            : "Cadastrar"}
        </AuthButton>
      </form>
    </AuthLayout>
  );
}