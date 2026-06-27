import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import Seo from "../components/Seo";
import heroVideo from "../assets/video.mp4";
import "./BookingChoice.css";

export default function BookingChoice() {
  const navigate = useNavigate();
  const { language = "EN" } = useContext(LanguageContext);

  const text = {
    title: {
      AR: "اختر نوع المستخدم",
      EN: "Choose Account Type",
      FR: "Choisissez le type de compte",
    },
    subtitle: {
      AR: "حدد حسابك للبدء في خدمة السحب والمساعدة",
      EN: "Pick your account type to start towing and assistance service",
      FR: "Selectionnez votre compte pour commencer le service",
    },
    customer: { AR: "زبون", EN: "Customer", FR: "Client" },
    agency: { AR: "وكالة", EN: "Agency", FR: "Agence" },
  };

  return (
    <section className="bc-page" dir={language === "AR" ? "rtl" : "ltr"}>
      <Seo
        title="Reservation Depannage Auto"
        description="Choisissez votre acces client ou agence pour reserver un depannage auto, une assistance routiere ou un remorquage HIGHDEP."
        path="/booking-choice"
        keywords="reservation depannage auto, remorquage reservation, assistance routiere algerie"
      />
      <video autoPlay loop muted playsInline className="bc-video">
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="bc-overlay" />
      <div className="bc-content container">
        <h1>{text.title[language]}</h1>
        <p>{text.subtitle[language]}</p>

        <div className="bc-actions">
          <button className="bc-btn bc-btn-customer" onClick={() => navigate("/booking-customer")}>
            {text.customer[language]}
          </button>
          <button className="bc-btn bc-btn-agency" onClick={() => navigate("/agency-login")}>
            {text.agency[language]}
          </button>
        </div>
      </div>
    </section>
  );
}
