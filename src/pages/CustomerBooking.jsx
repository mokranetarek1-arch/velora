import React from "react";
import BookingForm from "../components/BookingForm";
import Seo from "../components/Seo";

export default function BookingCustomer() {
  return (
    <div className="container py-5">
      <Seo
        title="Demande de Depannage Auto"
        description="Envoyez votre demande de depannage auto, remorquage ou assistance routiere HIGHDEP avec calcul du kilometrage avant confirmation."
        path="/booking-customer"
        keywords="demande depannage auto, remorquage voiture, assistance routiere reservation"
      />
      <h3 className="mb-4 text-center">Bienvenue</h3>
      <BookingForm userType="customer" />
    </div>
  );
}
