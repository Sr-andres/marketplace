import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook para navegación
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase"; // Firebase configurado
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Para redirigir al Marketplace

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Inicio de sesión exitoso");
      navigate("/marketplace"); // Redirige al Marketplace
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Inicio de sesión con Google exitoso");
      navigate("/marketplace"); // Redirige al Marketplace
    } catch (err) {
      setError("Error al iniciar sesión con Google.");
    }
  };

  return (
    <div>
      <h2 className="title-inic">WELCOME A REESTRENAYA</h2> 
      
      <div className="login-container">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Iniciar sesión</button>
        </form>
        <button className="google-login" onClick={handleGoogleLogin}>
          Iniciar sesión con Google
        </button>
        {error && <p className="error-message">{error}</p>}
        <h4 className="register">
          ¿No tienes cuenta? <br />
          <a className="register" href="">Regístrate aquí</a>
        </h4>
      </div>
    </div>
  );
}; 

export default Login;
