import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { DevPreview } from "./DevPreview";
import { LoginPage } from "./pages/LoginPage";
import "./index.css";

const routes = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/dev/preview",
    Component: DevPreview,
  },
]);

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);

(import.meta.hot.data.root ??= createRoot(elem)).render(app);
