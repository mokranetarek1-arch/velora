import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./Register.css";

export default function Register({ role = "agency" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        phone,
        role,
        createdAt: new Date(),
      });

      navigate("/booking");
    } catch (err) {
      console.error(err);
      alert("Erreur de creation de compte: " + err.message);
    }
  };

  return (
    <section className="register-page">
      <div className="register-card-pro">
        <h2>Creer un compte agence</h2>

        <form onSubmit={handleRegister}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet" className="form-control mb-3" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="form-control mb-3" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" className="form-control mb-3" required />
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telephone" className="form-control mb-4" required />

          <button type="submit" className="btn register-primary-btn w-100">Creer le compte</button>
        </form>

        <button className="btn register-secondary-btn w-100 mt-3" onClick={() => navigate("/agency-login")}>J'ai deja un compte</button>
      </div>
    </section>
  );
}
