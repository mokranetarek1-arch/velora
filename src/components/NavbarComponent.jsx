import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NavbarComponent() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand>🚗 HighDep Services</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">{t("Home")}</Nav.Link>
          <Nav.Link as={Link} to="/booking">{t("Booking Service")}</Nav.Link>
          <Nav.Link as={Link} to="/about">{t("About")}</Nav.Link>
          <Nav.Link as={Link} to="/contact">{t("Contact")}</Nav.Link>
        </Nav>
        <div>
          <Button size="sm" onClick={() => changeLanguage("ar")}>AR</Button>{" "}
          <Button size="sm" onClick={() => changeLanguage("en")}>EN</Button>
        </div>
      </Container>
    </Navbar>
  );
}
