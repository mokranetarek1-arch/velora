import React from "react";
import { FaArrowRight, FaCheckCircle, FaPercent, FaPhoneAlt, FaUsers } from "react-icons/fa";
import Seo from "../components/Seo";
import "./Partner.css";

export default function Partner() {
  return (
    <section className="partner-page">
      <Seo
        title="Devenir Partenaire Chauffeur"
        description="Rejoignez HIGHDEP comme chauffeur partenaire, recevez des demandes de depannage et remorquage, et developpez votre activite."
        path="/partner"
        keywords="devenir partenaire depannage auto, chauffeur remorquage, partenaire highdep"
      />

      <div className="partner-hero">
        <div className="partner-copy">
          <span className="partner-kicker">Reseau chauffeurs HIGHDEP</span>
          <h1>Devenir partenaire</h1>
          <p>
            Rejoignez notre reseau de chauffeurs et professionnels du remorquage pour recevoir
            des missions, augmenter votre chiffre d'affaires et travailler avec une application dediee.
          </p>

          <div className="partner-actions">
            <a
              href="https://play.google.com/store/apps/details?id=com.highdep_app&hl=fr"
              target="_blank"
              rel="noopener noreferrer"
              className="partner-btn partner-btn-primary"
            >
              Telecharger l'application <FaArrowRight />
            </a>
            <a href="tel:+213556327170" className="partner-btn partner-btn-secondary">
              <FaPhoneAlt /> Nous contacter
            </a>
          </div>
        </div>

        <div className="partner-app-box">
          <span className="partner-app-tag">Depalink</span>
          <h2>Telechargez Depalink</h2>
          <p>
            L'application dediee uniquement a nos partenaires pour recevoir les missions,
            suivre les demandes et gerer les interventions plus rapidement.
          </p>
        </div>
      </div>

      <div className="partner-grid">
        <article className="partner-card">
          <div className="partner-icon"><FaUsers /></div>
          <h2>Profil recherche</h2>
          <p>
            Chauffeurs, depanneurs et professionnels equipes pour intervenir rapidement
            sur des missions de depannage auto et remorquage.
          </p>
        </article>

        <article className="partner-card">
          <div className="partner-icon"><FaCheckCircle /></div>
          <h2>Comment ca marche</h2>
          <ul>
            <li>Installez l'application partenaire.</li>
            <li>Creez votre profil professionnel.</li>
            <li>Recevez les demandes disponibles autour de vous.</li>
            <li>Acceptez les missions et suivez vos interventions.</li>
          </ul>
        </article>

        <article className="partner-card">
          <div className="partner-icon"><FaPercent /></div>
          <h2>Commission</h2>
          <p>
            Le principe est simple : vous recevez des missions via la plateforme et une
            commission est appliquee selon le service traite. Le taux exact est defini
            lors de la validation du partenariat.
          </p>
        </article>
      </div>
    </section>
  );
}
