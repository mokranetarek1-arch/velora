import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Image, Dropdown, Offcanvas, Navbar } from "react-bootstrap";
import {
  FaHome,
  FaCalendarAlt,
  FaInfoCircle,
  FaPhone,
  FaStore,
  FaGlobe,
  FaUsers,
} from "react-icons/fa";
import { LanguageContext } from "../context/LanguageContext";
import IconLogo from "../assets/ICON.png";
import "./Navbar.css";

export default function AppNavbar() {
  const [expanded, setExpanded] = useState(false);
  const { language, setLanguage } = useContext(LanguageContext);

  useEffect(() => {
    document.documentElement.dir = language === "AR" ? "rtl" : "ltr";
  }, [language]);

  const links = [
    { path: "/", labelFR: "Marche", labelAR: "السوق", labelEN: "Market", icon: <FaStore /> },
  ];

  const getLabel = (link) => {
    if (language === "FR") return link.labelFR;
    if (language === "AR") return link.labelAR;
    return link.labelEN;
  };

  return (
    <>
      <Navbar className="hd-navbar-mobile">
        <NavLink to="/" onClick={() => setExpanded(false)} className="hd-brand">
          <Image src={IconLogo} alt="Velora" height="40" />
          <span>Velora</span>
        </NavLink>

        <Navbar.Toggle
          aria-controls="navbar-nav"
          onClick={() => setExpanded(!expanded)}
          className="hd-navbar-toggle"
        />
      </Navbar>

      <aside className="hd-navbar-side">
        <NavLink to="/" className="hd-brand hd-brand-side">
          <Image src={IconLogo} alt="Velora" height="44" />
          <span>Velora</span>
        </NavLink>

        <Nav className="hd-nav-shell">
          {links.map((link) => (
            <Nav.Link
              key={link.path}
              as={NavLink}
              to={link.path}
              end={link.path === "/"}
              className="hd-nav-link"
            >
              {link.icon}
              <span>{getLabel(link)}</span>
            </Nav.Link>
          ))}
        </Nav>

        <Dropdown className="hd-lang-dropdown">
          <Dropdown.Toggle className="hd-lang-btn" variant="none">
            <FaGlobe /> {language}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setLanguage("FR")}>FR - Francais</Dropdown.Item>
            <Dropdown.Item onClick={() => setLanguage("AR")}>AR - العربية</Dropdown.Item>
            <Dropdown.Item onClick={() => setLanguage("EN")}>EN - English</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </aside>

      <Offcanvas
        id="navbar-nav"
        placement="start"
        show={expanded}
        onHide={() => setExpanded(false)}
        className="hd-offcanvas"
      >
        <Offcanvas.Header closeButton className="hd-offcanvas-header">
          <Offcanvas.Title className="hd-offcanvas-title">Velora</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="hd-nav-shell">
            {links.map((link) => (
              <Nav.Link
                key={link.path}
                as={NavLink}
                to={link.path}
                end={link.path === "/"}
                onClick={() => setExpanded(false)}
                className="hd-nav-link"
              >
                {link.icon}
                <span>{getLabel(link)}</span>
              </Nav.Link>
            ))}
          </Nav>

          <Dropdown className="hd-lang-dropdown hd-lang-dropdown-mobile">
            <Dropdown.Toggle className="hd-lang-btn" variant="none">
              <FaGlobe /> {language}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setLanguage("FR")}>FR - Francais</Dropdown.Item>
              <Dropdown.Item onClick={() => setLanguage("AR")}>AR - العربية</Dropdown.Item>
              <Dropdown.Item onClick={() => setLanguage("EN")}>EN - English</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="hd-navbar-spacer" />
    </>
  );
}
