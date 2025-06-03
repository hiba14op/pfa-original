import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Order {
  orderId: number;
  productName: string;
  totalAmount: number;
  deliveryAddress: string;
  status: string;
  date: string;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("✅ OrderList monté !");
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/orders/my';
    axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        console.log("📦 Données reçues pour OrderList :", res.data);
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des commandes:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes Commandes</h1>

      {loading ? (
        <p>Chargement en cours...</p>
      ) : orders.length === 0 ? (
        <p>Vous n'avez passé aucune commande pour l'instant.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
        <div
          key={order.orderId}
          className="p-4 border rounded-lg shadow bg-white"
        >
              <h2 className="font-semibold text-lg">
                Produit : {order.productName || 'Non spécifié'}
              </h2>
              <p>Montant : {order.totalAmount} €</p>
              <p>Adresse : {order.deliveryAddress || 'Inconnue'}</p>
              <p>Status : {order.status}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;