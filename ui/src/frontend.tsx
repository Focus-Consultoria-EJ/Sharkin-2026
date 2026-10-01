import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { RecoveryStepRoute } from "@/components/auth/RecoveryStepRoute";
import { PasswordRecoveryProvider } from "@/contexts/PasswordRecoveryContext";

import { LoginPage } from "./pages/LoginPage";
import { UserPage } from "./pages/UserPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { RecoverPasswordPage } from "./pages/RecoverPasswordPage";
import { VerificationCodePage } from "./pages/VerificationCodePage";
import "./index.css";

const routes = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/usuario",
    Component: UserPage,
  },
  {
    path: "/cadastro",
    Component: RegisterPage,
  },
  {
    path: "/recuperar-senha",
    element: (
      <RecoveryStepRoute expectedStep="email">
        <RecoverPasswordPage />
      </RecoveryStepRoute>
    ),
  },
  {
    path: "/verificar-codigo",
    element: (
      <RecoveryStepRoute expectedStep="code">
        <VerificationCodePage />
      </RecoveryStepRoute>
    ),
  },
  {
    path: "/redefinir-senha",
    element: (
      <RecoveryStepRoute expectedStep="password">
        <ResetPasswordPage />
      </RecoveryStepRoute>
    ),
  },
]);

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <PasswordRecoveryProvider>
      <RouterProvider router={routes} />
    </PasswordRecoveryProvider>
  </StrictMode>
);

(import.meta.hot.data.root ??= createRoot(elem)).render(app);
