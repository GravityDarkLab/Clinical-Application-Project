import { Link } from "react-router-dom";
import "./styles/WelcomeScreen.css";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./elements/LoginButton";
import LogoutButton from "./elements/LogoutButton";
import {
  faSearch,
  faPlus,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import React, { useState } from "react";

Modal.setAppElement("#root");

function Welcome() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  async function accessToken() {
    const fetchedToken = await getAccessTokenSilently();
    setToken(fetchedToken);
    setModalOpen(true);
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(token);
      console.log("Token copied to clipboard");
      setModalOpen(false); // Close the modal after copying
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  return (
    <div className="welcome-screen">
      <h1 className="welcome-screen-title">
        Welcome to the Patients Management System
      </h1>

      {isAuthenticated ? (
        <div className="welcome-screen-options ">
          <button className="accessToken-button" onClick={accessToken}>
            {" "}
            Show JWT Token{" "}
          </button>
          <Link to="/patient" className="welcome-screen-option search">
            <div className="option-content">
              <FontAwesomeIcon icon={faSearch} className="option-icon" />
              <span className="welcome-screen-option-text">
                Search and View Patients
              </span>
            </div>
          </Link>
          <Link to="/add" className="welcome-screen-option add">
            <div className="option-content">
              <FontAwesomeIcon icon={faPlus} className="option-icon" />
              <span className="welcome-screen-option-text">
                Add a New Patient
              </span>
            </div>
          </Link>
          <Link
            to="/observations"
            className="welcome-screen-option observations"
          >
            <div className="option-content">
              <FontAwesomeIcon icon={faStethoscope} className="option-icon" />
              <span className="welcome-screen-option-text">
                All Observations
              </span>
            </div>
          </Link>
          <LogoutButton />
        </div>
      ) : (
        <LoginButton />
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Your Token"
        style={{
          content: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2em",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            width: "300px",
            height: "200px",
            maxWidth: "90%",
            margin: "auto",
          },
        }}
      >
        <h2 style={{ marginBottom: "1em", color: "#333", fontSize: "1.2em" }}>
          Your Token
        </h2>
        <div
          style={{
            color: "#666",
            marginBottom: "0.4em",
            wordWrap: "break-word",
            maxHeight: "50px",
            overflowY: "auto",
          }}
        >
          <p>{token}</p>
        </div>
        <button
          style={{
            padding: "0.5em 1em",
            color: "#fff",
            backgroundColor: "#007BFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={copyToClipboard}
        >
          Copy to clipboard
        </button>
      </Modal>
    </div>
  );
}

export default Welcome;
