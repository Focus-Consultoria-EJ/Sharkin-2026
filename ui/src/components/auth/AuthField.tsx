import { useState } from "react";

type AuthFieldProps = {
  id: string;
  type: "email" | "text" | "password";
  placeholder: string;
  icon: string;
  showPasswordIcon?: string;
  hidePasswordIcon?: string;
  autoComplete?: string;
};

export function AuthField({
  id,
  type,
  placeholder,
  icon,
  showPasswordIcon,
  hidePasswordIcon,
  autoComplete,
}: AuthFieldProps) {
  const [passwordVisible, setPasswordVisible] =
    useState(false);

  const isPassword = type === "password";

  const renderedType =
    isPassword && passwordVisible ? "text" : type;

  const visibilityIcon = passwordVisible
    ? hidePasswordIcon
    : showPasswordIcon;

  function handleVisibility() {
    setPasswordVisible((currentValue) => !currentValue);
  }

  return (
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
        name={id}
        type={renderedType}
        placeholder={placeholder}
        autoComplete={autoComplete}
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
  );
}