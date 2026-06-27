// src/components/PriceSimulator.jsx
import React, { useState } from "react";

export default function PriceSimulator({ onSimulate }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [simPrice, setSimPrice] = useState("");

  const calculatePrice = () => {
    if (!start || !end) return alert("الرجاء إدخال نقطتي البداية والنهاية");

    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [start],
        destinations: [end],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status !== "OK") {
          alert("تعذر حساب المسافة");
          return;
        }

        const element = response.rows[0].elements[0];
        if (element.status !== "OK") {
          alert("العنوان غير صالح ⚠️");
          return;
        }

        const distanceInMeters = element.distance.value;
        const distanceInKm = distanceInMeters / 1000;

        // نحسب السعر (50 دج/كم)
        const price = Math.round(distanceInKm * 50);

        setSimPrice(`${price} دج`);
        onSimulate(`${price} دج`);
      }
    );
  };

  return (
    <div className="mb-3">
      <h5>محاكي السعر</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="نقطة الانطلاق (مدينة، عنوان...)"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="وجهة الوصول"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />
      <button
        type="button"
        className="btn btn-outline-primary w-100"
        onClick={calculatePrice}
      >
        حساب السعر
      </button>

      {simPrice && (
        <p className="mt-3 text-success">
          السعر المقدر: <strong>{simPrice}</strong>
        </p>
      )}
    </div>
  );
}
