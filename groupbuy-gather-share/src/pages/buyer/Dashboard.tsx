// filepath: 
import React, { useEffect, useState } from "react";
import axios from "axios";

const BuyerDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [orders, setOrders] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [savings, setSavings] = useState(0);
  const [loading, setLoading] = useState(true);
   console.log("Dashboard monté");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      setLoading(false);
      return;
    }

Promise.all([
  axios.get("/api/groupparticipation/my", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setGroups(res.data)).catch(() => setGroups([])),

  axios.get("/api/orders", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setOrders(res.data)).catch(() => setOrders([])),

  axios.get("/api/needs", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setNeeds(res.data)).catch(() => setNeeds([])),

  axios.get("/api/savings", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setSavings(res.data.total || 0)).catch(() => setSavings(0))
]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h2>Tableau de bord Acheteur</h2>
      <div>
        <div>Groupes actifs : {groups.length}</div>
        <div>Commandes : {orders.length}</div>
        <div>Économies totales : {savings}€</div>
        <div>Besoins exprimés : {needs.length}</div>
      </div>
    </div>
  );
};

export default BuyerDashboard;