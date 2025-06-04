import { useEffect, useState } from 'react';
import axios from 'axios';

interface Group {
  orderId: number;
  productName: string;
  totalAmount: number;
  deliveryAddress: string;
  currentGroupSize: number;
  maxGroupSize: number;
  isJoined?: boolean;
}

interface GroupListProps {
  fetchData: () => void;
}

const GroupList: React.FC<GroupListProps> = ({ fetchData }) => {
  const [groups, setGroups] = useState<Group[]>([]);

  // État pour la barre de recherche
  const [searchTerm, setSearchTerm] = useState('');

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
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "❌ Erreur lors de la participation");
    }
  };

  const handleLeave = async (orderId: number) => {
    try {
      await axios.post(`http://localhost:5000/api/grouporder/${orderId}/leave`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert("✅ Groupe quitté !");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "❌ Erreur lors de la sortie du groupe");
    }
  };

  // 🔍 Filtrage des groupes selon le terme recherché (insensible à la casse)
  const filteredGroups = groups.filter(group =>
    group.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Groupes Disponibles</h2>

      {/* Barre de recherche par produit */}
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      {filteredGroups.length === 0 ? (
        <p>Aucun groupe disponible pour ce produit.</p>
      ) : (
        filteredGroups.map(group => (
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
