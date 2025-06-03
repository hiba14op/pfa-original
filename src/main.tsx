// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";     // ou votre CSS global
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
