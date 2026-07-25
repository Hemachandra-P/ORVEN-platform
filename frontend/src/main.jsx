import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/globals.css";

import App from "./App";

import AuthProvider from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);