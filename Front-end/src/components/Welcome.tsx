import { Link } from "react-router-dom";
import "./styles/WelcomeScreen.css";

function Welcome() {
  return (
    <div className="welcome-screen">
      <h1 className="welcome-screen-title">
        Welcome to the Patients Management System
      </h1>
      <div className="welcome-screen-options ">
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
        {/* TODO: EDIT Patients */}
        <Link to="/edit" className="welcome-screen-option edit">
          <span className="welcome-screen-option-icon">✏️</span>
          <span className="welcome-screen-option-text">Edit a Patient</span>
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
