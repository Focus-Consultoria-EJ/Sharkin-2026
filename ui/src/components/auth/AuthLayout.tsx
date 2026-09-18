import { useId, type ReactNode } from "react";
import cornerDecoration from "@/assets/focus/90_degrees_circle.png";
import "@/styles/auth_styles.css";

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  size?: "wide" | "compact";
  accent?: "forward" | "reverse";
  children: ReactNode;
};

export function AuthLayout({
  title,
  subtitle,
  size = "wide",
  accent = "forward",
  children,
}: AuthLayoutProps) {
  const titleId = useId();

  return (
    <main className="auth-page">
      <section
        className={[
          "auth-card",
          `auth-card--${size}`,
          `auth-card--accent-${accent}`,
        ].join(" ")}
        aria-labelledby={titleId}
      >
        <img
          className={[
            "auth-card__accent",
            "auth-card__accent--first",
          ].join(" ")}
          src={cornerDecoration}
          alt=""
          aria-hidden="true"
        />

        <img
          className={[
            "auth-card__accent",
            "auth-card__accent--second",
          ].join(" ")}
          src={cornerDecoration}
          alt=""
          aria-hidden="true"
        />

        <header className="auth-card__header">
          <h1 id={titleId}>{title}</h1>

          {subtitle && (
            <p className="auth-card__subtitle">
              {subtitle}
            </p>
          )}
        </header>

        {children}
      </section>
    </main>
  );
}