// Imports the main React library
import React from "react";

// Imports the main CSS file for the application
import "./index.css";

// Imports the createRoot method for enabling React concurrent mode
import { createRoot } from "react-dom/client";

// Imports the Auth0Provider component from the Auth0 React library for authentication
import { Auth0Provider } from "@auth0/auth0-react";

// Imports the main App component of the React application
import App from "./App";

// Initializes the root element for the application with concurrent mode
const root = createRoot(document.getElementById("root") as Element);

// Renders the application into the root element
root.render(
  <React.StrictMode>
    <Auth0Provider
      // Defines the Auth0 domain
      domain="dev-iev30nuk0firr85e.eu.auth0.com"
      // Defines the Auth0 client ID
      clientId="uDd4TGNMnPzkxiXzZ38pKhkQjAlochEy"
      // Sets the authorization parameters for Auth0
      authorizationParams={{
        // Defines the redirect URI after successful authentication
        redirect_uri: window.location.origin,

        // Sets the audience for Auth0
        audience: "medTechAPI2023",

        // Defines the scope for Auth0
        scope: "openid Observation Patient Media email",
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
