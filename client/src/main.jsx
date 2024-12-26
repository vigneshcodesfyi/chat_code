import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { UserProvider } from "./UserContext";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
