import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./input.css";
import PatientForm from "./components/PatientInput";
import PatientList from "./components/ViewPatients";
import Welcome from "./components/Welcome";
import PatientDetails from "./components/PatientDetails";
import ObservationInput from "./components/ObservationInput";
import ObservationDetails from "./components/ObservationDetails";
import { useAuth0 } from "@auth0/auth0-react";
import Observations from "./components/ObservationList";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/patient" element={<PatientList />} />
            <Route path="/add" element={<PatientForm />} />
            <Route path="/patient/:patientId" element={<PatientDetails />} />
            <Route path="/observations/:patientId" element={<Observations />} />
            <Route
              path="/observations/addObservation/:patientId"
              element={<ObservationInput />}
            />
            <Route
              path="/observation/:observationId"
              element={<ObservationDetails />}
            />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Welcome />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
