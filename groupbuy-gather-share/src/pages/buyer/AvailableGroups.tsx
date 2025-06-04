import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AvailableGroups = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/grouporder/open', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((res) => setGroups(res.data))
    .catch((err) => console.error("Erreur chargement groupes :", err));
  }, []);

  const joinGroup = async (groupId: number) => {
    try {
      await axios.post(`http://localhost:5000/api/grouporder/${groupId}/join`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert("✅ Groupe rejoint avec succès !");
      window.location.reload();
    } catch (err) {
      alert("❌ Impossible de rejoindre ce groupe.");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Groupes Disponibles</h2>
      {groups.length === 0 ? (
        <p>Aucun groupe disponible pour l’instant.</p>
      ) : (
        groups.map((group: any) => (
          <div key={group.orderId} className="bg-white shadow p-4 mb-4 rounded">
            <p><strong>Produit :</strong> {group.productName}</p>
            <p><strong>Montant :</strong> {group.totalAmount} €</p>
            <p><strong>Adresse :</strong> {group.deliveryAddress}</p>
            <p><strong>Places :</strong> {group.currentGroupSize}/{group.maxGroupSize}</p>
            {!group.isJoined ? (
              <button
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => joinGroup(group.orderId)}
              >
                Rejoindre
              </button>
            ) : (
              <span className="text-blue-500 mt-2 inline-block">Déjà membre</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AvailableGroups;
