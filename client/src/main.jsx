import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <AppProvider>
        <ScrollToTop />
        <App />
      </AppProvider>
    </AuthProvider>
  </BrowserRouter>
);