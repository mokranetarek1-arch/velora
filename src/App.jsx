import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppNavbar from "./components/Navbar";
import Market from "./pages/Market";
import ProductDetail from "./pages/ProductDetail";

import "./App.css";

function App() {
  return (
    <Router>
      <AppNavbar />
      <main className="app-main-shell">
        <Routes>
          <Route path="/" element={<Market />} />
          <Route path="/market" element={<Market />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
