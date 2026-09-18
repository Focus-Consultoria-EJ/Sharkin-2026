import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { LoginPage } from "./pages/LoginPage";
import { UserPage } from "./pages/UserPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { RecoverPasswordPage } from "./pages/RecoverPasswordPage";
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
    path: "/redefinir-senha",
    Component: ResetPasswordPage,
  },
  {
    path: "/recuperar-senha",
    Component: RecoverPasswordPage,
  },
]);

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);

(import.meta.hot.data.root ??= createRoot(elem)).render(app);
