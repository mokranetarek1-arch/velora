import React, { useContext, useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, Form, Button } from "react-bootstrap";
import { LanguageContext } from "../context/LanguageContext";
import "./BookingFormPro.css";

const PHOTON_API_URL = "https://photon.komoot.io";
const OSRM_API_URL = "https://router.project-osrm.org";
const SEARCH_DELAY_MS = 400;

function formatPhotonResult(feature) {
  const { properties = {} } = feature;
  const parts = [
    properties.name,
    properties.street,
    properties.housenumber,
    properties.postcode,
    properties.city,
    properties.state,
    properties.country,
  ].filter(Boolean);

  return parts.join(", ");
}

async function searchLocations(query) {
  const url = `${PHOTON_API_URL}/api/?q=${encodeURIComponent(query)}&limit=5&lang=fr`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Search failed");
  }

  const data = await response.json();
  return (data.features || []).map((feature) => ({
    id: feature.properties?.osm_id || feature.properties?.osm_key || feature.geometry?.coordinates?.join(","),
    label: formatPhotonResult(feature),
    lat: feature.geometry?.coordinates?.[1],
    lon: feature.geometry?.coordinates?.[0],
  }));
}

async function reverseGeocode(lat, lon) {
  const url = `${PHOTON_API_URL}/reverse?lat=${lat}&lon=${lon}&lang=fr`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Reverse geocoding failed");
  }

  const data = await response.json();
  const feature = data.features?.[0];

  if (!feature) {
    return {
      label: `${lat}, ${lon}`,
      lat,
      lon,
    };
  }

  return {
    label: formatPhotonResult(feature) || `${lat}, ${lon}`,
    lat: feature.geometry?.coordinates?.[1] ?? lat,
    lon: feature.geometry?.coordinates?.[0] ?? lon,
  };
}

async function geocodeLocation(query) {
  const results = await searchLocations(query);
  return results[0] || null;
}

async function calculateRoute(startCoords, endCoords) {
  const coordinates = `${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}`;
  const url = `${OSRM_API_URL}/route/v1/driving/${coordinates}?overview=false`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Route request failed");
  }

  const data = await response.json();
  const route = data.routes?.[0];

  if (!route) {
    throw new Error("No route found");
  }

  return {
    distanceKm: route.distance / 1000,
    durationMinutes: route.duration / 60,
  };
}

export default function BookingForm({ userType = "customer" }) {
  const { language } = useContext(LanguageContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [carName, setCarName] = useState("");
  const [imatriculation, setImatriculation] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [startResults, setStartResults] = useState([]);
  const [endResults, setEndResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [routeSummary, setRouteSummary] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const text = {
    title: { AR: "احجز خدمتك الآن", EN: "Book Now", FR: "Reservez" },
    firstName: { AR: "الاسم", EN: "First Name", FR: "Prenom" },
    lastName: { AR: "اللقب", EN: "Last Name", FR: "Nom" },
    phone: { AR: "رقم الهاتف", EN: "Phone", FR: "Telephone" },
    carName: { AR: "اسم السيارة", EN: "Car Name", FR: "Voiture" },
    imatriculation: { AR: "رقم التسجيل", EN: "Registration", FR: "Matricule" },
    start: { AR: "نقطة الانطلاق", EN: "Start", FR: "Depart" },
    end: { AR: "الوجهة", EN: "Destination", FR: "Destination" },
    useMyLocation: { AR: "موقعي", EN: "My location", FR: "Ma position" },
    locating: { AR: "جار التحديد...", EN: "Locating...", FR: "Localisation..." },
    calculating: { AR: "جار الحساب...", EN: "Calculating...", FR: "Calcul..." },
    submit: { AR: "ارسال الطلب", EN: "Send", FR: "Envoyer" },
    success: {
      AR: "تم إرسال طلبك بنجاح.",
      EN: "Your request has been sent.",
      FR: "Votre demande a ete envoyee.",
    },
    locationError: {
      AR: "تعذر تحديد الموقع.",
      EN: "Unable to detect location.",
      FR: "Impossible de recuperer votre position.",
    },
    routeError: {
      AR: "تعذر حساب المسافة. اختر عنوانا اوضح.",
      EN: "Unable to calculate distance. Choose a clearer address.",
      FR: "Impossible de calculer la distance. Choisissez une adresse plus precise.",
    },
    confirmationTitle: { AR: "تأكيد الطلب", EN: "Request confirmation", FR: "Confirmation de la demande" },
    confirmationText: {
      AR: "راجع المعلومات قبل تأكيد الطلب.",
      EN: "Review the details before confirming the request.",
      FR: "Verifiez les informations avant de confirmer la demande.",
    },
    identitySection: { AR: "معلومات العميل", EN: "Customer details", FR: "Informations client" },
    tripSection: { AR: "تفاصيل الرحلة", EN: "Trip details", FR: "Details du trajet" },
    distance: { AR: "المسافة", EN: "Distance", FR: "Kilometrage" },
    duration: { AR: "المدة", EN: "Duration", FR: "Duree estimee" },
    confirm: { AR: "تأكيد الطلب", EN: "Confirm request", FR: "Confirmer la demande" },
    cancel: { AR: "الغاء", EN: "Cancel", FR: "Annuler" },
  };

  useEffect(() => {
    if (start.trim().length < 3) {
      setStartResults([]);
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setStartResults(await searchLocations(start.trim()));
      } catch (error) {
        console.error(error);
        setStartResults([]);
      }
    }, SEARCH_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [start]);

  useEffect(() => {
    if (end.trim().length < 3) {
      setEndResults([]);
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setEndResults(await searchLocations(end.trim()));
      } catch (error) {
        console.error(error);
        setEndResults([]);
      }
    }, SEARCH_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [end]);

  const handleSelectSuggestion = (field, item) => {
    if (field === "start") {
      setStart(item.label);
      setStartCoords({ lat: item.lat, lon: item.lon });
      setStartResults([]);
      return;
    }

    setEnd(item.label);
    setEndCoords({ lat: item.lat, lon: item.lon });
    setEndResults([]);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert(text.locationError[language]);
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const address = await reverseGeocode(lat, lon);
          setStart(address.label);
          setStartCoords({ lat: address.lat, lon: address.lon });
          setStartResults([]);
        } catch (error) {
          console.error(error);
          setStart(`${lat}, ${lon}`);
          setStartCoords({ lat, lon });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
        alert(text.locationError[language]);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resolvedStart = startCoords || (await geocodeLocation(start.trim()));
      const resolvedEnd = endCoords || (await geocodeLocation(end.trim()));

      if (!resolvedStart || !resolvedEnd) {
        throw new Error("Missing coordinates");
      }

      const summary = await calculateRoute(resolvedStart, resolvedEnd);

      setStartCoords({ lat: resolvedStart.lat, lon: resolvedStart.lon });
      setEndCoords({ lat: resolvedEnd.lat, lon: resolvedEnd.lon });
      setRouteSummary(summary);
      setShowConfirm(true);
    } catch (error) {
      console.error(error);
      alert(text.routeError[language]);
    } finally {
      setLoading(false);
    }
  };

  const confirmSubmit = async () => {
    setLoading(true);

    try {
      const user = auth.currentUser;
      const data = {
        firstName,
        lastName,
        phone,
        carName,
        imatriculation,
        date,
        start,
        end,
        startPoint: start,
        endPoint: end,
        status: "Pending",
        createdAt: serverTimestamp(),
      };

      if (userType === "agency" && user) data.agencyId = user.uid;

      await addDoc(collection(db, "orders"), data);
      alert(text.success[language]);

      setShowConfirm(false);
      setFirstName("");
      setLastName("");
      setPhone("");
      setCarName("");
      setImatriculation("");
      setDate("");
      setStart("");
      setEnd("");
      setStartCoords(null);
      setEndCoords(null);
      setStartResults([]);
      setEndResults([]);
      setRouteSummary(null);
    } catch (err) {
      console.error(err);
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="booking-card-pro">
        <Card.Body>
          <h3 className="booking-title">{text.title[language]}</h3>

          <Form onSubmit={submit}>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Control
                  placeholder={text.firstName[language]}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <Form.Control
                  placeholder={text.lastName[language]}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <Form.Control
              className="mt-3"
              placeholder={text.phone[language]}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Form.Control
              className="mt-3"
              placeholder={text.carName[language]}
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              required
            />
            <Form.Control
              className="mt-3"
              placeholder={text.imatriculation[language]}
              value={imatriculation}
              onChange={(e) => setImatriculation(e.target.value)}
              required
            />
            <Form.Control
              type="datetime-local"
              className="mt-3"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <div className="booking-autocomplete mt-3">
              <Form.Control
                placeholder={text.start[language]}
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  setStartCoords(null);
                  setRouteSummary(null);
                }}
                autoComplete="off"
                required
              />
              {startResults.length > 0 && (
                <div className="booking-suggestions">
                  {startResults.map((item) => (
                    <button
                      key={`start-${item.id}-${item.label}`}
                      type="button"
                      className="booking-suggestion-item"
                      onClick={() => handleSelectSuggestion("start", item)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="button"
              className="mt-2 btn-location-pro"
              onClick={handleUseMyLocation}
              disabled={isLocating}
            >
              {isLocating ? text.locating[language] : text.useMyLocation[language]}
            </Button>

            <div className="booking-autocomplete mt-3">
              <Form.Control
                placeholder={text.end[language]}
                value={end}
                onChange={(e) => {
                  setEnd(e.target.value);
                  setEndCoords(null);
                  setRouteSummary(null);
                }}
                autoComplete="off"
                required
              />
              {endResults.length > 0 && (
                <div className="booking-suggestions">
                  {endResults.map((item) => (
                    <button
                      key={`end-${item.id}-${item.label}`}
                      type="button"
                      className="booking-suggestion-item"
                      onClick={() => handleSelectSuggestion("end", item)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="btn-submit-pro mt-4" disabled={loading}>
              {loading ? text.calculating[language] : text.submit[language]}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {showConfirm && (
        <div className="confirm-overlay-pro">
          <div className="confirm-modal-pro">
            <div className="confirm-header-pro">
              <h4>{text.confirmationTitle[language]}</h4>
              <p>{text.confirmationText[language]}</p>
            </div>

            <div className="confirm-section-pro">
              <h5>{text.identitySection[language]}</h5>
              <div className="confirm-grid-pro">
                <div className="confirm-item-pro">
                  <span>{text.firstName[language]}</span>
                  <strong>{firstName}</strong>
                </div>
                <div className="confirm-item-pro">
                  <span>{text.lastName[language]}</span>
                  <strong>{lastName}</strong>
                </div>
                <div className="confirm-item-pro">
                  <span>{text.phone[language]}</span>
                  <strong>{phone}</strong>
                </div>
                <div className="confirm-item-pro">
                  <span>{text.carName[language]}</span>
                  <strong>{carName}</strong>
                </div>
                <div className="confirm-item-pro">
                  <span>{text.imatriculation[language]}</span>
                  <strong>{imatriculation}</strong>
                </div>
                <div className="confirm-item-pro">
                  <span>Date</span>
                  <strong>{date}</strong>
                </div>
              </div>
            </div>

            <div className="confirm-section-pro">
              <h5>{text.tripSection[language]}</h5>
              <div className="confirm-grid-pro">
                <div className="confirm-item-pro confirm-item-wide-pro">
                  <span>{text.start[language]}</span>
                  <strong>{start}</strong>
                </div>
                <div className="confirm-item-pro confirm-item-wide-pro">
                  <span>{text.end[language]}</span>
                  <strong>{end}</strong>
                </div>
              </div>
            </div>

            {routeSummary && (
              <div className="confirm-summary-pro">
                <div className="confirm-summary-item-pro">
                  <span>{text.distance[language]}</span>
                  <strong>{routeSummary.distanceKm.toFixed(1)} km</strong>
                </div>
                <div className="confirm-summary-item-pro">
                  <span>{text.duration[language]}</span>
                  <strong>{Math.round(routeSummary.durationMinutes)} min</strong>
                </div>
              </div>
            )}

            <div className="confirm-actions-pro">
              <Button variant="success" onClick={confirmSubmit}>{text.confirm[language]}</Button>
              <Button variant="outline-secondary" onClick={() => setShowConfirm(false)}>{text.cancel[language]}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
