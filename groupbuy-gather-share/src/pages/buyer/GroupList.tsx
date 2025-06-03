import { useEffect, useState } from 'react';
import axios from 'axios';

interface Group {
  orderId: number;
  productName: string;
  totalAmount: number;
  deliveryAddress: string;
  currentGroupSize: number;
  maxGroupSize: number;
  isJoined?: boolean; // Ajout de la propriété isJoined
}

interface GroupListProps {
  fetchData: () => void;
}

const GroupList: React.FC<GroupListProps> = ({ fetchData }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  
  useEffect(() => {
    axios.get('http://localhost:5000/api/grouporder/open', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => setGroups(res.data))
      .catch(err => console.error('❌ Erreur chargement groupes :', err));
  }, []);

  const handleJoin = async (orderId: number) => {
    try {
      await axios.post(`http://localhost:5000/api/grouporder/${orderId}/join`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert("✅ Groupe rejoint !");
      fetchData(); // recharge les données parent si nécessaire
    } catch (err: any) {
      alert(err.response?.data?.message || "❌ Erreur lors de la participation");
    }
  };

  // Added function to leave a group
  const handleLeave = async (orderId: number) => {
    try {
      await axios.post(`http://localhost:5000/api/grouporder/${orderId}/leave`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert("✅ Groupe quitté !");
      fetchData(); // recharge les données parent si nécessaire
    } catch (err: any) {
      alert(err.response?.data?.message || "❌ Erreur lors de la sortie du groupe");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Groupes Disponibles</h2>
      {groups.length === 0 ? (
        <p>Aucun groupe disponible pour l'instant.</p>
      ) : (
        groups.map(group => (
          <div key={group.orderId} className="border p-3 mb-2 rounded shadow bg-white">
            <p><strong>Produit :</strong> {group.productName || 'Non spécifié'}</p>
            <p><strong>Montant :</strong> {group.totalAmount} €</p>
            <p><strong>Adresse :</strong> {group.deliveryAddress || 'Non spécifiée'}</p>
            <p><strong>Places :</strong> {group.currentGroupSize} / {group.maxGroupSize}</p>
                {group.isJoined ? (
              <button
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleLeave(group.orderId)}
              >
                Quitter
              </button>
            ) : (
              <button
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => handleJoin(group.orderId)}
              >
                Rejoindre
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GroupList;
