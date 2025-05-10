import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/Product.css";
import { CartProvider } from "./Pages/ProductCart";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
);
