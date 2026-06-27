// src/pages/Booking.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import BookingForm from "../components/BookingForm";
import OrdersTable from "../components/OrdersTable";
import Statistics from "../components/Statistics";
import { ButtonGroup, Button } from "react-bootstrap";

export default function Booking() {
  const [userName, setUserName] = useState(null);
  const [role, setRole] = useState(null); // null | customer | agency
  const [activeTab, setActiveTab] = useState("booking");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      console.log("🔎 Current user:", user);

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("✅ User data:", data);
          setRole(data.role || null);
          setUserName(data.name || "مستخدم");
        } else {
          console.log("⚠️ No user document found in Firestore");
        }
      } catch (err) {
        console.error("Firestore error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // حالة التحميل
  if (loading) {
    return <div className="container py-5">⏳ جاري التحميل...</div>;
  }

  // حالة عدم وجود مستخدم
  if (!auth.currentUser) {
    return (
      <div className="container py-5">
        ⚠️ الرجاء تسجيل الدخول أولا
      </div>
    );
  }

  // حالة عدم وجود role
  if (!role) {
    return (
      <div className="container py-5">
        ⚠️ حسابك غير مهيأ بعد، تواصل مع الدعم.
      </div>
    );
  }

  // واجهة الزبون العادي
  if (role === "customer") {
    return (
      <div className="container py-5">
        <h3>مرحبا بك، {userName} 👋</h3>
        <BookingForm userType="customer" />
      </div>
    );
  }

  // واجهة الوكالة / المحترف
  return (
    <div className="container py-5">
      <h3 className="mb-4">Bienvenue, {userName} 👋</h3>

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
