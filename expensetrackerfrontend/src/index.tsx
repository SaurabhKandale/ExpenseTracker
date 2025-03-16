import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import { system } from "./theme";
import { Toaster } from "./Components/ui/toaster";
import { Router } from "./routes";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "react-datepicker/dist/react-datepicker.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
    <ChakraProvider value={system}>
      <Toaster />
      <Provider store={store}>
        <RouterProvider router={Router} />
      </Provider>
    </ChakraProvider>
  // </React.StrictMode>
);

reportWebVitals();
