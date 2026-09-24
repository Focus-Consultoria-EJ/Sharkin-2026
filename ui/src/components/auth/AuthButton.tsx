import type { ReactNode } from "react";

type AuthButtonProps = {
  children: ReactNode;
  disabled?: boolean;
};

export function AuthButton({
  children,
  disabled = false,
}: AuthButtonProps) {
  return (
    <button
      className="auth-button"
      type="submit"
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}