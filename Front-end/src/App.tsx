import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./input.css";
import PatientForm from "./components/Patients/PatientInput";
import PatientList from "./components/Patients/ViewPatients";
import Welcome from "./components/Welcome";
import PatientDetails from "./components/Patients/PatientDetails";
import ObservationInput from "./components/Observations/ObservationInput";
import ObservationDetails from "./components/Observations/ObservationDetails";
import PatientObservationsList from "./components/Observations/PatientObservationsList";
import { AuthenticationGuard } from "./components/Utils/AuthenticationGuard";
import ObservationAll from "./components/Observations/ObservationAll";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route
            path="/patient"
            element={<AuthenticationGuard component={PatientList} />}
          />
          <Route
            path="/observations"
            element={<AuthenticationGuard component={ObservationAll} />}
          />
          <Route
            path="/add"
            element={<AuthenticationGuard component={PatientForm} />}
          />
          <Route
            path="/patient/:patientId"
            element={<AuthenticationGuard component={PatientDetails} />}
          />
          <Route
            path="/observations/:patientId"
            element={
              <AuthenticationGuard component={PatientObservationsList} />
            }
          />
          <Route
            path="/observations/addObservation/:patientId"
            element={<AuthenticationGuard component={ObservationInput} />}
          />
          <Route
            path="/observation/:observationId"
            element={<AuthenticationGuard component={ObservationDetails} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
