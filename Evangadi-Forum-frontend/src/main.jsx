import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./component/Dataprovider/DataProvider";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter } from "react-router-dom";

const authToken = localStorage.getItem("authtoken");
const initialUserData = authToken
  ? { user: undefined, token: authToken }
  : { user: undefined, token: undefined };

const rootElement = document.getElementById("root");

createRoot(rootElement).render(
  <React.StrictMode>
    <UserProvider value={initialUserData}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
