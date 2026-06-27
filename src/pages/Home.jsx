import React, { useState, useEffect, useContext } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaTools,
  FaTruck,
  FaBatteryFull,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaPhoneAlt,
  FaWhatsapp,
  FaShieldAlt,
} from "react-icons/fa";
import { LanguageContext } from "../context/LanguageContext";
import logo from "../assets/logo.png";
import hero from "../assets/video.mp4";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Seo from "../components/Seo";
import "./Home.css";

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: "easeOut" },
  }),
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export default function Home() {
  const { language } = useContext(LanguageContext);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const navigate = useNavigate();

  const phone = "0556 32 71 70";
  const cleanPhone = `+213${phone.replace(/\D/g, "")}`;
  const whatsappLink = "https://wa.me/213556327170";
  const seoJsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "HIGHDEP",
    url: "https://www.highdep.com/",
    image: "https://www.highdep.com/ICONe.png",
    telephone: "+213556327170",
    areaServed: ["Alger", "Oran", "Blida", "Constantine", "Setif", "Annaba", "Algerie"],
    description:
      "Service de depannage auto, remorquage et assistance routiere 24/7 en Algerie avec intervention rapide.",
    serviceType: ["Depannage auto", "Remorquage", "Assistance routiere", "Batterie et demarrage"],
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
      setLoadingProducts(false);
    });

    return () => unsubscribe();
  }, []);

  const scrollCarousel = (direction) => {
    const wrapper = document.getElementById("productsWrapper");
    if (wrapper) {
      wrapper.scrollBy({ left: direction * 320, behavior: "smooth" });
    }
  };

  const text = {
    heroTitle: {
      FR: "Assistance routiere premium, intervention rapide et remorquage securise 24/7.",
      EN: "Premium roadside assistance with fast intervention and secure towing, 24/7.",
      AR: "?????? ????? ???????? ?? ???? ???? ???? ??? ??? ???? ??????.",
    },
    heroSubtitle: {
      FR: "HIGHDEP protege votre mobilite partout en Algerie, avec une equipe experte et une prise en charge immediate.",
      EN: "HIGHDEP keeps you moving across Algeria with an expert team and immediate support.",
      AR: "HIGHDEP ???? ????? ?? ?? ????? ??????? ??? ???? ???? ???????? ?????.",
    },
    heroButton: {
      FR: "Reserver maintenant",
      EN: "Book now",
      AR: "???? ????",
    },
    trustItems: {
      FR: ["Intervention en moins de 30 min*", "Service 24/7", "Equipe certifiee"],
      EN: ["Intervention in under 30 min*", "24/7 availability", "Certified team"],
      AR: ["???? ???? ??? ?? 30 ?????*", "???? 24/7", "???? ?????"],
    },
    missionTitle: {
      FR: "Notre mission",
      EN: "Our mission",
      AR: "??????",
    },
    missionDesc: {
      FR: "Offrir une assistance fiable, humaine et immediate pour que chaque conducteur reprenne la route en toute confiance.",
      EN: "Deliver reliable, human, and immediate support so every driver can get back on the road with confidence.",
      AR: "????? ?????? ?????? ?????? ?????? ?????? ??? ???? ?? ???? ?????? ????.",
    },
    servicesTitle: {
      FR: "Services essentiels",
      EN: "Core services",
      AR: "??????? ????????",
    },
    services: [
      {
        icon: <FaTools size={22} />,
        title: {
          FR: "Depannage sur place",
          EN: "On-site troubleshooting",
          AR: "????? ?? ??? ??????",
        },
        desc: {
          FR: "Diagnostic rapide et reparation immediate pour repartir sans remorquage si possible.",
          EN: "Fast diagnostics and immediate fix to avoid towing whenever possible.",
          AR: "????? ???? ?????? ???? ?????? ????? ???? ????.",
        },
      },
      {
        icon: <FaTruck size={22} />,
        title: {
          FR: "Remorquage securise",
          EN: "Secure towing",
          AR: "??? ???",
        },
        desc: {
          FR: "Transport professionnel de votre vehicule vers le garage de votre choix.",
          EN: "Professional vehicle transport to the garage you choose.",
          AR: "??? ??????? ??????? ??? ?????? ???? ???????.",
        },
      },
      {
        icon: <FaBatteryFull size={22} />,
        title: {
          FR: "Batterie et demarrage",
          EN: "Battery and jump-start",
          AR: "?????? ??????",
        },
        desc: {
          FR: "Recharge ou remplacement batterie avec assistance en urgence.",
          EN: "Battery recharge or replacement with emergency support.",
          AR: "??? ?? ????? ???????? ?? ???? ????????.",
        },
      },
    ],
    whyTitle: {
      FR: "Pourquoi HIGHDEP",
      EN: "Why HIGHDEP",
      AR: "????? HIGHDEP",
    },
    whyChoose: [
      {
        icon: <FaClock size={20} />,
        title: {
          FR: "Intervention rapide",
          EN: "Fast dispatch",
          AR: "???? ????",
        },
        desc: {
          FR: "Un reseau de partenaires locaux pour reduire le temps d'attente.",
          EN: "Local partner network to minimize waiting time.",
          AR: "???? ????? ????? ?????? ??? ????????.",
        },
      },
      {
        icon: <FaShieldAlt size={20} />,
        title: {
          FR: "Fiabilite totale",
          EN: "Trusted reliability",
          AR: "??????? ?????",
        },
        desc: {
          FR: "Suivi clair de votre demande avec prise en charge de bout en bout.",
          EN: "Clear request tracking with end-to-end support.",
          AR: "?????? ????? ????? ?? ??????? ??? ???????.",
        },
      },
      {
        icon: <FaCheckCircle size={20} />,
        title: {
          FR: "Expertise terrain",
          EN: "Field expertise",
          AR: "???? ???????",
        },
        desc: {
          FR: "Equipe formee aux urgences routieres, de jour comme de nuit.",
          EN: "Road emergency-trained team, day and night.",
          AR: "???? ????? ??????? ??????? ???? ??????.",
        },
      },
    ],
    productsTitle: {
      FR: "Nos produits",
      EN: "Our products",
      AR: "????????",
    },
    productsLoading: {
      FR: "Chargement des produits...",
      EN: "Loading products...",
      AR: "??? ????? ????????...",
    },
    productsEmpty: {
      FR: "Aucun produit disponible pour le moment.",
      EN: "No products available right now.",
      AR: "?? ???? ?????? ?????.",
    },
    orderNow: {
      FR: "Commander",
      EN: "Order now",
      AR: "???? ????",
    },
    partnersTitle: {
      FR: "Espace partenaires",
      EN: "Partner network",
      AR: "???? ???????",
    },
    partnersDesc: {
      FR: "Rejoignez notre reseau pour recevoir des missions et augmenter votre activite.",
      EN: "Join our network to receive missions and grow your activity.",
      AR: "???? ??? ?????? ???????? ?????? ?????? ?????.",
    },
    partnerSteps: {
      FR: [
        "Installez l'application partenaire",
        "Completez votre profil professionnel",
        "Recevez et acceptez des missions en temps reel",
      ],
      EN: [
        "Install the partner app",
        "Complete your business profile",
        "Receive and accept live missions",
      ],
      AR: [
        "??? ????? ??????",
        "???? ???? ??????",
        "?????? ????? ?????? ??????",
      ],
    },
    partnerCta: {
      FR: "Devenir partenaire",
      EN: "Become a partner",
      AR: "?? ?????",
    },
    footerRights: {
      FR: "Tous droits reserves",
      EN: "All rights reserved",
      AR: "???? ?????? ??????",
    },
  };

  const ProductCard = ({ product }) => {
    const images =
      product.imageURLs && product.imageURLs.length > 0
        ? product.imageURLs
        : product.imageURL
        ? [product.imageURL]
        : [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const price = Number(product.price) || 0;

    return (
      <article className="hd-product-card">
        <div className="hd-product-media">
          {images.length > 0 ? (
            <img
              className="hd-product-image"
              src={images[currentIndex]}
              alt={product.name || "Product"}
            />
          ) : (
            <div className="hd-product-placeholder">HIGHDEP</div>
          )}

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="hd-image-nav hd-image-nav-left"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                aria-label="Previous image"
              >
                &#10094;
              </button>
              <button
                type="button"
                className="hd-image-nav hd-image-nav-right"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                aria-label="Next image"
              >
                &#10095;
              </button>
            </>
          )}
        </div>

        <div className="hd-product-body">
          <h3>{product.name || "Produit"}</h3>
          <p>{price.toLocaleString()} DZD</p>
          <button
            type="button"
            className="hd-btn hd-btn-ghost"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {text.orderNow[language]}
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="hd-home" dir={language === "AR" ? "rtl" : "ltr"}>
      <Seo
        title="Depannage Auto et Remorquage 24/7 en Algerie"
        description="HIGHDEP propose un service de depannage auto, remorquage et assistance routiere 24/7 en Algerie avec intervention rapide et reservation en ligne."
        path="/"
        keywords="depannage auto algerie, remorquage alger, assistance routiere, depannage voiture 24/7, depanneuse algerie"
        jsonLd={seoJsonLd}
      />
      <section className="hd-hero">
        <video autoPlay loop muted playsInline className="hd-hero-video">
          <source src={hero} type="video/mp4" />
        </video>
        <div className="hd-hero-overlay" />
        <div className="hd-hero-grid">
          <Motion.div initial="hidden" animate="visible" variants={stagger}>
            <Motion.img
              src={logo}
              alt="HIGHDEP"
              className="hd-hero-logo"
              variants={reveal}
              custom={0.05}
            />
            <Motion.h1 className="hd-hero-title" variants={reveal} custom={0.12}>
              {text.heroTitle[language]}
            </Motion.h1>
            <Motion.p className="hd-hero-subtitle" variants={reveal} custom={0.2}>
              {text.heroSubtitle[language]}
            </Motion.p>

            <Motion.div className="hd-cta-row" variants={reveal} custom={0.3}>
              <button
                type="button"
                className="hd-btn hd-btn-primary"
                onClick={() => navigate("/booking-choice")}
              >
                {text.heroButton[language]} <FaArrowRight />
              </button>

              <a href={`tel:${cleanPhone}`} className="hd-btn hd-btn-dark">
                <FaPhoneAlt /> {phone}
              </a>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hd-btn hd-btn-whatsapp"
              >
                <FaWhatsapp /> WhatsApp
              </a>
            </Motion.div>

            <Motion.ul className="hd-trust-list" variants={reveal} custom={0.4}>
              {text.trustItems[language].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Motion.ul>
          </Motion.div>

          <Motion.div
            className="hd-hero-card"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            <div className="hd-hero-card-top">
              <span className="hd-hero-card-kicker">Assistance premium</span>
              <h3>HIGHDEP</h3>
            </div>
            <p>{text.missionDesc[language]}</p>
            <div className="hd-hero-card-line" />
            <div className="hd-hero-stats">
              <article>
                <strong>24/7</strong>
                <span>Support</span>
              </article>
              <article>
                <strong>+2500</strong>
                <span>Interventions</span>
              </article>
              <article>
                <strong>98%</strong>
                <span>Satisfaction</span>
              </article>
            </div>
          </Motion.div>
        </div>
      </section>

      <Motion.section
        className="hd-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <Motion.h2 variants={reveal}>{text.servicesTitle[language]}</Motion.h2>
        <Motion.p className="hd-section-intro" variants={reveal} custom={0.08}>
          {text.missionTitle[language]}: {text.missionDesc[language]}
        </Motion.p>
        <div className="hd-service-grid">
          {text.services.map((service) => (
            <Motion.article key={service.title.EN} className="hd-info-card" variants={reveal}>
              <div className="hd-icon-wrap">{service.icon}</div>
              <h3>{service.title[language]}</h3>
              <p>{service.desc[language]}</p>
            </Motion.article>
          ))}
        </div>
      </Motion.section>

      <Motion.section
        className="hd-section hd-section-alt"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <Motion.h2 variants={reveal}>{text.whyTitle[language]}</Motion.h2>
        <div className="hd-why-grid">
          {text.whyChoose.map((item) => (
            <Motion.article key={item.title.EN} className="hd-why-card" variants={reveal}>
              <div className="hd-icon-wrap">{item.icon}</div>
              <h3>{item.title[language]}</h3>
              <p>{item.desc[language]}</p>
            </Motion.article>
          ))}
        </div>
      </Motion.section>

      <Motion.section
        className="hd-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <Motion.div className="hd-section-head" variants={reveal}>
          <h2>{text.productsTitle[language]}</h2>
          <div className="hd-carousel-controls">
            <button type="button" onClick={() => scrollCarousel(-1)}>
              &#10094;
            </button>
            <button type="button" onClick={() => scrollCarousel(1)}>
              &#10095;
            </button>
          </div>
        </Motion.div>

        {loadingProducts ? (
          <p className="hd-empty-state">{text.productsLoading[language]}</p>
        ) : products.length === 0 ? (
          <p className="hd-empty-state">{text.productsEmpty[language]}</p>
        ) : (
          <div className="hd-products-wrapper" id="productsWrapper">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Motion.section>

      <Motion.section
        className="hd-section hd-partners"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <Motion.div className="hd-partners-box" variants={reveal}>
          <h2>{text.partnersTitle[language]}</h2>
          <p>{text.partnersDesc[language]}</p>
          <ul>
            {text.partnerSteps[language].map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <a
            href="https://play.google.com/store/apps/details?id=com.highdep_app&hl=fr"
            target="_blank"
            rel="noopener noreferrer"
            className="hd-btn hd-btn-primary"
          >
            {text.partnerCta[language]} <FaArrowRight />
          </a>
        </Motion.div>
      </Motion.section>

      <footer className="hd-footer">
        <div className="hd-footer-links">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a
            href="https://www.instagram.com/highdep_/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61577261453764"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </div>
        <p>
          2026 HIGHDEP. {text.footerRights[language]}
        </p>
      </footer>
    </div>
  );
}

