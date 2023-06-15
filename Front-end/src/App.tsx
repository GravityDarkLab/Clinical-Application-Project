import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./input.css";
import PatientForm from "./components/PatientInput";
import PatientList from "./components/ViewPatients";
import Welcome from "./components/Home";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/search" element={<PatientList />} />
          <Route path="/add" element={<PatientForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
