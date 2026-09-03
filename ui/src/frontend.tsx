import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { DevPreview } from "./DevPreview";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
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
