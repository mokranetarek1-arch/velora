import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { Table } from "react-bootstrap";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("agencyId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  const renderBadge = (status) => {
    if (status === "Pending") return <span className="badge bg-warning text-dark px-2">Pending</span>;
    if (status === "Accepted") return <span className="badge bg-info px-2">Accepted</span>;
    if (status === "Done") return <span className="badge bg-success px-2">Done</span>;
    return <span className="badge bg-secondary px-2">{status || "-"}</span>;
  };

  return (
    <div className="mt-4">
      <h5>Vos dernieres demandes</h5>
      <Table striped hover responsive className="align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Vehicule</th>
            <th>Immatriculation</th>
            <th>Client</th>
            <th>Tel</th>
            <th>De</th>
            <th>A</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o.id}>
              <td>{i + 1}</td>
              <td>{o.carName || "-"}</td>
              <td>{o.imatriculation || "-"}</td>
              <td>{[o.firstName, o.lastName].filter(Boolean).join(" ") || "-"}</td>
              <td>{o.phone || "-"}</td>
              <td>{o.start || o.startPoint || "-"}</td>
              <td>{o.end || o.endPoint || "-"}</td>
              <td>{o.date || "-"}</td>
              <td>{renderBadge(o.status)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
