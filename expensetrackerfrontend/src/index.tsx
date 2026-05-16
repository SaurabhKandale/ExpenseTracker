import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./Components/ui/toaster";
import { Router } from "./routes";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ThemeProvider } from "./context/ThemeContext";
import "react-datepicker/dist/react-datepicker.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
    <ThemeProvider>
      <Toaster />
      <Provider store={store}>
        <RouterProvider router={Router} />
      </Provider>
    </ThemeProvider>
  // </React.StrictMode>
);

reportWebVitals();
