import React from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "./pages/_layout";
import "./assets/globals.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);
