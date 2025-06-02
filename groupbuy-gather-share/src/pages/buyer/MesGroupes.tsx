import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Group {
  orderId: number;
  productName: string;
  totalAmount: number;
  deliveryAddress: string;
  currentGroupSize: number;
  maxGroupSize: number;
}

const MesGroupes: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("✅ MesGroupes monté !");
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
axios.get(`${API_URL}/groupparticipation/my`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})
      .then((res) => {
        console.log("📦 Données reçues pour MesGroupes :", res.data);
        setGroups(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des groupes:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes Groupes</h1>

      {loading ? (
        <p>Chargement en cours...</p>
      ) : groups.length === 0 ? (
        <p>Vous n'avez rejoint aucun groupe pour l'instant.</p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group.orderId}
              className="p-4 border rounded-lg shadow bg-white"
            >
              <h2 className="font-semibold text-lg">
                Produit : {group.productName}
              </h2>
              <p>Montant : {group.totalAmount} €</p>
              <p>Adresse : {group.deliveryAddress || 'Inconnue'}</p>
              <p>
                Places : {group.currentGroupSize} / {group.maxGroupSize}
              </p>\
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesGroupes;
