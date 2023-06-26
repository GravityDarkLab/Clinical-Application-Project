import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./input.css";
import PatientForm from "./components/PatientInput";
import PatientList from "./components/ViewPatients";
import Welcome from "./components/Welcome";
import PatientDetails from "./components/PatientDetails";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/patient" element={<PatientList />} />
          <Route path="/add" element={<PatientForm />} />
          <Route path="/patient/:patientId" element={<PatientDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
