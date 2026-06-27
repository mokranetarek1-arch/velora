import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { LanguageContext } from "../context/LanguageContext";
import Seo from "../components/Seo";
import "./About.css";

export default function About() {
  const { language = "EN" } = useContext(LanguageContext);

  useEffect(() => {
    document.documentElement.dir = language === "AR" ? "rtl" : "ltr";
  }, [language]);

  const texts = {
    EN: {
      heroTitle: "About HIGHDEP",
      heroDesc: "Professional towing and roadside assistance with fast intervention and transparent follow-up.",
      cards: [
        { icon: "Fast", title: "Rapid Dispatch", text: "A nearby team is assigned quickly for urgent requests." },
        { icon: "Safe", title: "Safe Handling", text: "Your vehicle is transported with secure and adapted equipment." },
        { icon: "Live", title: "Live Tracking", text: "Clear updates from request to arrival at destination." },
      ],
      aboutText: [
        "HIGHDEP combines speed, professionalism and customer care. Every mission is handled with the same quality standard.",
        "Our vision is to become the trusted assistance network across Algeria, available 24/7 for individuals and partners.",
      ],
    },
    FR: {
      heroTitle: "A propos de HIGHDEP",
      heroDesc: "Service professionnel de remorquage et d'assistance avec intervention rapide et suivi transparent.",
      cards: [
        { icon: "Rapide", title: "Intervention rapide", text: "Une equipe proche est affectee rapidement a votre demande." },
        { icon: "Securise", title: "Prise en charge sure", text: "Votre vehicule est transporte avec un materiel adapte et fiable." },
        { icon: "Suivi", title: "Suivi en direct", text: "Des mises a jour claires du debut jusqu'a la destination." },
      ],
      aboutText: [
        "HIGHDEP combine rapidite, professionnalisme et qualite de service. Chaque mission suit un standard eleve.",
        "Notre vision est d'etre le reseau d'assistance de reference en Algerie, disponible 24/7.",
      ],
    },
    AR: {
      heroTitle: "من نحن HIGHDEP",
      heroDesc: "خدمة احترافية للسحب والمساعدة الطرقية مع تدخل سريع ومتابعة واضحة.",
      cards: [
        { icon: "سريع", title: "تدخل سريع", text: "يتم توجيه أقرب فريق لطلبك في أقصر وقت." },
        { icon: "آمن", title: "نقل آمن", text: "يتم نقل المركبة بمعدات مناسبة ومعايير أمان عالية." },
        { icon: "متابعة", title: "متابعة مباشرة", text: "تحديثات واضحة من بداية الطلب حتى الوصول." },
      ],
      aboutText: [
        "HIGHDEP تجمع بين السرعة والاحترافية وجودة الخدمة. كل مهمة تتم وفق معايير عالية.",
        "رؤيتنا أن نكون شبكة المساعدة الأكثر ثقة في الجزائر على مدار الساعة.",
      ],
    },
  };

  const t = texts[language] || texts.EN;

  return (
    <section className="about-page" dir={language === "AR" ? "rtl" : "ltr"}>
      <Seo
        title="A Propos de HIGHDEP"
        description="Decouvrez HIGHDEP, service de depannage auto, remorquage et assistance routiere avec intervention rapide en Algerie."
        path="/about"
        keywords="a propos highdep, depannage auto algerie, remorquage, assistance routiere"
      />
      <div className="about-hero">
        <Container>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDesc}</p>
        </Container>
      </div>

      <Container className="about-content">
        <div className="about-grid">
          {t.cards.map((card) => (
            <article key={card.title} className="about-card-pro">
              <span>{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>

        <div className="about-story">
          {t.aboutText.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p>
            HIGHDEP accompagne les conducteurs et les partenaires a la recherche d'un service fiable de depannage automobile,
            remorquage et assistance 24/7 en Algerie.
          </p>
        </div>
      </Container>
    </section>
  );
}
