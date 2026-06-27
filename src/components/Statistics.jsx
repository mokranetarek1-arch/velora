// src/components/Statistics.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Card, Row, Col } from "react-bootstrap";

export default function Statistics() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    accepted: 0,
    done: 0,
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "orders"), where("agencyId", "==", user.uid));

    const unsub = onSnapshot(q, (snap) => {
      let total = 0;
      let pending = 0;
      let accepted = 0;
      let done = 0;

      snap.docs.forEach((doc) => {
        const data = doc.data();
        total++;
        if (data.status === "Pending") pending++;
        else if (data.status === "Accepted") accepted++;
        else if (data.status === "Done") done++;
      });

      setStats({ totalOrders: total, pending, accepted, done });
    });

    return () => unsub();
  }, []);

  return (
    <div className="mt-4">
      <Row>
        <Col md={3}>
          <Card className="text-center p-3 mb-3">
            <h6>إجمالي الطلبات</h6>
            <h4>{stats.totalOrders}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3 mb-3">
            <h6>قيد الانتظار</h6>
            <h4>{stats.pending}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3 mb-3">
            <h6>تم قبولها</h6>
            <h4>{stats.accepted}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3 mb-3">
            <h6>تمت الرحلات</h6>
            <h4>{stats.done}</h4>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
