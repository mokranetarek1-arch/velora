import React, { useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "15px"
};

const center = {
  lat: 36.7538,
  lng: 3.0588,
};

export default function MapPicker({ onLocationSelect }) {
  const [marker, setMarker] = useState(center);
  const [map, setMap] = useState(null);
  const [address, setAddress] = useState("");
  const autocompleteRef = useRef(null);

  const API_KEY = "AIzaSyC2956nP5LknC6VXWodeYP7RRU-Yt217Ek";

  // 📍 عند الضغط على الخريطة
  const handleClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setMarker({ lat, lng });

    const addr = await getAddress(lat, lng);
    setAddress(addr);

    if (onLocationSelect) {
      onLocationSelect({ lat, lng, address: addr });
    }
  };

  // 🔁 تحويل coords → address
  const getAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
      );
      const data = await res.json();
      return data.results[0]?.formatted_address || "Unknown location";
    } catch {
      return "Error getting address";
    }
  };

  // 🔍 عند البحث
  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setMarker({ lat, lng });
    setAddress(place.formatted_address);

    map.panTo({ lat, lng });

    if (onLocationSelect) {
      onLocationSelect({
        lat,
        lng,
        address: place.formatted_address
      });
    }
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
        
        {/* 🔍 Input بحث */}
        <Autocomplete
          onLoad={(auto) => (autocompleteRef.current = auto)}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="🔍 ابحث عن مكان..."
            className="map-search"
          />
        </Autocomplete>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={marker}
          zoom={13}
          onLoad={(mapInstance) => setMap(mapInstance)}
          onClick={handleClick}
        >
          <Marker position={marker} />
        </GoogleMap>
      </LoadScript>

      {/* 📍 عرض العنوان */}
      {address && (
        <p className="mt-2 text-center">
          📍 <strong>{address}</strong>
        </p>
      )}
    </div>
  );
}