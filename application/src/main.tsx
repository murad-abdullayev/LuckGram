import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

import "./styles/global.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster richColors expand />
  </Provider>
);
