import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./Components/App/App";
import UserLogin from "./Components/Login/UserLogin";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: () => {
      return redirect("/login");
    },
  },
  {
    path: "/login",
    element: <UserLogin />,
    loader: () => {
      if (localStorage.getItem("token")) {
        return redirect("/app/profile");
      }
      return true;
    },
  },
  {
    path: "/signup",
    element: <UserLogin isSignUp={true} />,
    loader: () => {
      if (localStorage.getItem("token")) {
        return redirect("/app/profile");
      }
      return true;
    },
  },
  {
    path: "/app/:tab",
    element: <App />,
  },
]);
