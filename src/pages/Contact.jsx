import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import Seo from "../components/Seo";
import "./Contact.css";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message envoye.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section className="contact-page">
      <Seo
        title="Contact Depannage Auto et Remorquage"
        description="Contactez HIGHDEP pour une demande de depannage auto, remorquage, assistance routiere ou partenariat en Algerie."
        path="/contact"
        keywords="contact depannage auto, remorquage algerie, assistance routiere contact"
      />
      <Container className="py-4">
        <div className="contact-head">
          <h1>Contactez-nous</h1>
          <p>Une question sur une reservation, un depannage auto ou un partenariat ? Ecrivez-nous.</p>
        </div>

        <Card className="contact-card-pro">
          <Form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p><strong>Telephone:</strong> <a href="tel:+213556327170">0556 32 71 70</a></p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/213556327170" target="_blank" rel="noopener noreferrer">Envoyer un message</a></p>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
            </Form.Group>

            <Button type="submit" className="contact-submit-btn">Envoyer</Button>
          </Form>
        </Card>
      </Container>
    </section>
  );
}
