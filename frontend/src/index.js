import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { WishlistProvider } from "./context/WishlistContext";

ReactDOM.render(
  <React.StrictMode>
    <WishlistProvider>
      <App />
    </WishlistProvider>
  </React.StrictMode>,
  document.getElementById("root")
);