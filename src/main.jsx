import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import Home from "./components/home/Home";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/LoginPage", element: <LoginPage /> },
  { path: "/RegisterPage", element: <RegisterPage /> },
  { path: "/Home", element: <Home /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
