import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";

export const AuthenticationGuard =  ({ component } : { component: React.FC }) => {
  const Component = withAuthenticationRequired(component);

  return <Component />;
};
