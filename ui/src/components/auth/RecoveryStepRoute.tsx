import type { ReactNode } from "react";
import { Navigate } from "react-router";

import {
  usePasswordRecovery,
  type PasswordRecoveryStep,
} from "@/contexts/PasswordRecoveryContext";

type RecoveryStepRouteProps = {
  expectedStep: PasswordRecoveryStep;
  children: ReactNode;
};

export function RecoveryStepRoute({
  expectedStep,
  children,
}: RecoveryStepRouteProps) {
  const { step } = usePasswordRecovery();

  if (step !== expectedStep) {
    return <Navigate to="/" replace />;
  }

  return children;
}
