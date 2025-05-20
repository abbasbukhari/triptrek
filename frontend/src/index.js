import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import WishlistContext from './context/WishlistContext.jsx';

ReactDOM.render(
  <React.StrictMode>
    <WishlistContext>
      <App />
    </WishlistContext>
  </React.StrictMode>,
  document.getElementById("root")
);