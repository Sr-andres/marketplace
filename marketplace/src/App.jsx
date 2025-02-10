import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./components/Login";
import Marketplace from "./components/Marketplace"; // Asegúrate de que la ruta sea correcta

const App = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Verifica el estado de autenticación del usuario
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // El usuario está autenticado
        console.log("Usuario autenticado:", currentUser);
        setUser(currentUser); // Guarda el usuario en el estado
      } else {
        // El usuario no está autenticado
        console.log("No hay usuario autenticado");
        setUser(null); // No hay usuario
      }
    });
  }, [auth]);

  return (
    <Router>
      <Routes>
        {/* Ruta de Login: Si el usuario está autenticado, redirige a Marketplace */}
        <Route path="/" element={user ? <Navigate to="/marketplace" /> : <Login />} />

        {/* Ruta al Marketplace: Solo accesible si el usuario está autenticado */}
        <Route path="/marketplace" element={user ? <Marketplace /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
