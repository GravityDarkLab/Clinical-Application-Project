import React from 'react';
import './App.css';
import './input.css';
import PatientForm from "./components/PatientInput"
import PatientList from './components/ViewPatients';

function App() {
  return (
    <div>
      <div className="flex justify-center p-10 bg-sky-800 text-5xl text-white">
        Enter new Patient
      </div>
      <div className="flex w-full justify-center text-3xl">
        <PatientForm></PatientForm>
      </div>
      <div className="flex w-full justify-center text-3xl">
        <PatientList></PatientList>
      </div>
  
    </div>
   
  );
}

export default App;
