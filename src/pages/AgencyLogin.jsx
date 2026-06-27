import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Seo from "../components/Seo";
import "./AgencyLogin.css";

export default function AgencyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        alert("Utilisateur introuvable");
        return;
      }

      const data = userDoc.data();
      if (data.role === "agency") navigate("/agency-dashboard");
      else navigate("/booking-choice");
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion: " + err.message);
    }
  };

  return (
    <section className="auth-page">
      <Seo
        title="Connexion Agence"
        description="Espace agence HIGHDEP pour gerer les demandes et les statistiques."
        path="/agency-login"
        noindex
      />
      <div className="auth-card">
        <h2>Espace Agence</h2>
        <p>Connectez-vous pour gerer vos demandes et statistiques.</p>

        <form onSubmit={handleLogin}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="form-control mb-3" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required className="form-control mb-4" />
          <button type="submit" className="btn auth-primary-btn w-100">Se connecter</button>
        </form>

        <div className="text-center mt-3">
          <small>Pas encore de compte ?</small>
          <button className="btn auth-secondary-btn mt-2 w-100" onClick={() => navigate("/register")}>Creer un compte</button>
        </div>
      </div>
    </section>
  );
}
