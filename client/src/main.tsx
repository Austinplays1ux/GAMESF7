import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./components/ui/theme-provider";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="gamesf7-theme">
    <App />
  </ThemeProvider>
);
