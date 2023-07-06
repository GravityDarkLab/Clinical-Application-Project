import { Link } from "react-router-dom";
import "./styles/WelcomeScreen.css";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

function Welcome() {
  const { isAuthenticated } = useAuth0();
  
  return (
    <div className="welcome-screen">
      <h1 className="welcome-screen-title">
        Welcome to the Patients Management System
      </h1>
      {isAuthenticated ? 
        (<div className="welcome-screen-options "> 
          <Link to="/patient" className="welcome-screen-option search">
            <span className="welcome-screen-option-icon">🔍</span>
            <span className="welcome-screen-option-text">
              Search and View Patients
            </span>
          </Link>
          <Link to="/add" className="welcome-screen-option add">
            <span className="welcome-screen-option-icon">➕</span>
            <span className="welcome-screen-option-text">Add a New Patient</span>
          </Link>
          <LogoutButton /> 
          </div>
        ) : ( 
          <LoginButton /> 
        )}
      {/* Add other Links if needed */}
    </div>
  );
}

export default Welcome;