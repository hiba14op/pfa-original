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
  const [searchTerm, setSearchTerm] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchGroups = () => {
    axios.get(`${API_URL}/groupparticipation/my`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
  };

  useEffect(() => {
    console.log("✅ MesGroupes monté !");
    fetchGroups();
  }, []);

  const handleLeave = (orderId: number) => {
    axios.post(`${API_URL}/grouporder/${orderId}/leave`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    .then(() => {
      alert("✅ Groupe quitté !");
      fetchGroups();
    })
    .catch((err) => {
      alert(err.response?.data?.message || "❌ Erreur lors de la sortie du groupe");
    });
  };

const handleStripePay = async (group: Group) => {
  try {
    const res = await axios.post(`${API_URL}/orders/create-checkout-session`, {
      productName: group.productName,
      amount: group.totalAmount,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });

    window.location.href = res.data.url; // Redirection vers Stripe Checkout
  } catch (error) {
    alert("❌ Paiement échoué");
    console.error("Erreur Stripe :", error);
  }
};




  const filteredGroups = groups.filter(group =>
    group.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes Groupes</h1>

      {/* ✅ Barre de recherche */}
<input
  type="text"
  placeholder="🔍 Rechercher un produit..."
  className="mb-6 p-3 border-2 border-blue-500 font-semibold shadow-md rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>


      {loading ? (
        <p>Chargement en cours...</p>
      ) : filteredGroups.length === 0 ? (
        <p>Aucun groupe trouvé.</p>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map((group) => (
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
              </p>
              <button
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleLeave(group.orderId)}
              >
                Quitter
              </button>
<button
  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded ml-2"
  onClick={() => handleStripePay(group)}
>
  Payer par carte
</button>



            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesGroupes;
