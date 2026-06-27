// src/components/ProductCard.jsx
import React from "react";
import "./ProductCard.css";

export default function ProductCard({ name, price, imageURL, description }) {
  return (
    <div className="product-card">
      <img src={imageURL} alt={name} />
      <h3>{name}</h3>
      <p>{price}</p>
      {description && <p className="desc">{description}</p>}
      <button>شراء</button>
    </div>
  );
}
