import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Hero(){
  const nav = useNavigate();
  return (
    <div className="hero mb-4" style={{ backgroundImage: "url('/images/hero.jpg')", minHeight: 320 }}>
      <div className="hero-overlay d-flex align-items-center">
        <Container>
          <h1>خدمة راب و جر سريعة وآمنة</h1>
          <p>نستلم مركبتك ونوصلها للوجهة بأمان — اطلب الخدمة الآن بكل سهولة.</p>
          <div className="mt-3">
            <Button className="me-2 btn-primary" onClick={()=>nav('/booking')}>احجز الآن</Button>
            <Button variant="light" onClick={()=>nav('/contact')}>أعرف أكثر</Button>
          </div>
        </Container>
      </div>
    </div>
  );
}
