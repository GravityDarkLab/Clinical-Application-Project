import React from 'react';
import "./index.css";
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root') as Element);

root.render(
  <React.StrictMode>
  <Auth0Provider
      domain="dev-iev30nuk0firr85e.eu.auth0.com"
      clientId="uDd4TGNMnPzkxiXzZ38pKhkQjAlochEy"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
        <App />
  </Auth0Provider>
  </React.StrictMode>
);