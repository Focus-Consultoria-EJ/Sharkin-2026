import type { ReactNode } from "react";

type AuthButtonProps = {
  children: ReactNode;
};

export function AuthButton({ children }: AuthButtonProps) {
  return (
    <button className="auth-button" type="submit">
      {children}
    </button>
  );
}