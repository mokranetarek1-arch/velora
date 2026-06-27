import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import "./Market.css";

const Market = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="mk-page">
      <Seo
        title="Boutique Velora"
        description="Découvrez la boutique Velora"
        path="/market"
        keywords="Velora, equipements auto, accessoires voiture, boutique pro"
      />

      <div className="container py-5">
        <div className="mk-head">
          <span className="mk-kicker">Sélection Velora</span>
          <h2>Velora Store</h2>
        </div>

        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : products.length === 0 ? (
          <div className="alert alert-info text-center">Aucun produit disponible pour le moment.</div>
        ) : (
          <div className="mk-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ProductCard = ({ product }) => {
  const images = product.imageURLs && product.imageURLs.length > 0 ? product.imageURLs : product.imageURL ? [product.imageURL] : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <article className="mk-card">
      <div className="mk-media">
        {images.length > 0 ? <img src={images[currentIndex]} alt={product.name} /> : <div className="mk-empty">No image</div>}

        {images.length > 1 && (
          <>
            <button className="mk-nav left" onClick={prevImage} type="button">&#10094;</button>
            <button className="mk-nav right" onClick={nextImage} type="button">&#10095;</button>
          </>
        )}

        <div className="mk-price-badge">{(Number(product.price) || 0).toLocaleString()} DZD</div>

        {product.description && (
          <div className="mk-detail-icon">
            i
            <div className="mk-tooltip">{product.description}</div>
          </div>
        )}
      </div>

      <div className="mk-body">
        <h3>{product.name}</h3>
        <p>{product.description || "Produit disponible à la commande sur Velora."}</p>
        <Link to={`/product/${product.id}`} className="mk-order-btn">Commander</Link>
      </div>
    </article>
  );
};

export default Market;
