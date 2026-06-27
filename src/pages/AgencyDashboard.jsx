// src/pages/AgencyDashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import BookingForm from "../components/BookingForm";
import OrdersTable from "../components/OrdersTable";
import Statistics from "../components/Statistics";
import { ButtonGroup, Button } from "react-bootstrap";

export default function AgencyDashboard() {
  const [userName, setUserName] = useState(null);
  const [activeTab, setActiveTab] = useState("booking");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(data.name || "وكالة");
        }
      } catch (err) {
        console.error("Firestore error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="container py-5">⏳ جاري التحميل...</div>;
  }

  if (!auth.currentUser) {
    return (
      <div className="container py-5">
        ⚠️ الرجاء تسجيل الدخول للوصول إلى لوحة التحكم.
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h3 className="mb-4">مرحبا بك، {userName} 👋</h3>

      <ButtonGroup className="mb-4">
        <Button
          variant={activeTab === "booking" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("booking")}
        >
          طلب جديد
        </Button>
        <Button
          variant={activeTab === "orders" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("orders")}
        >
          الرحلات السابقة
        </Button>
        <Button
          variant={activeTab === "stats" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("stats")}
        >
          الإحصائيات
        </Button>
      </ButtonGroup>

      {activeTab === "booking" && <BookingForm userType="agency" />}
      {activeTab === "orders" && <OrdersTable />}
      {activeTab === "stats" && <Statistics />}
    </div>
  );
}
