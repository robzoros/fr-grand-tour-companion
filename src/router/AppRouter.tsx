import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GestionPartidas from "../GestionPartidas";
// import Inicio from "../pages/Inicio"; // Opcional, por si tienes una portada personalizada

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GestionPartidas modoCarga="inicio" />} />
        <Route path="/seguir/:id" element={<GestionPartidas modoCarga="seguir" />} />
        <Route path="/lectura/:id" element={<GestionPartidas modoCarga="lectura" />} />
        {/* <Route path="/inicio" element={<Inicio />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;

