import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type AuthFieldProps = {
  id: string;
  type: "email" | "text" | "password";
  placeholder: string;
  icon: string;
  showPasswordIcon?: string;
  hidePasswordIcon?: string;
  autoComplete?: string;
  registration?: UseFormRegisterReturn;
  error?: string;
};

export function AuthField({
  id,
  type,
  placeholder,
  icon,
  showPasswordIcon,
  hidePasswordIcon,
  autoComplete,
  registration,
  error,
}: AuthFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isPassword = type === "password";

  const renderedType =
    isPassword && passwordVisible ? "text" : type;

  const visibilityIcon = passwordVisible
    ? hidePasswordIcon
    : showPasswordIcon;

  const errorId = `${id}-error`;

  function handleVisibility() {
    setPasswordVisible((currentValue) => !currentValue);
  }

  return (
    <div className="auth-control">
      <div className="auth-field">
        <label
          className="auth-visually-hidden"
          htmlFor={id}
        >
          {placeholder}
        </label>

        <img
          className="auth-field__leading-icon"
          src={icon}
          alt=""
          aria-hidden="true"
        />

        <input
          id={id}
          name={registration?.name ?? id}
          type={renderedType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...(registration ?? {})}
        />

        {isPassword && visibilityIcon && (
          <button
            type="button"
            className="auth-field__visibility"
            aria-label={
              passwordVisible
                ? "Ocultar senha"
                : "Mostrar senha"
            }
            aria-pressed={passwordVisible}
            onClick={handleVisibility}
          >
            <img
              src={visibilityIcon}
              alt=""
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          className="auth-field__error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}