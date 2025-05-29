import { useEffect, useState } from 'react';
import axios from 'axios';


interface GroupListProps {
  fetchData: () => void;
}

const GroupList: React.FC<GroupListProps> = ({ fetchData }) => {

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/grouporder')
      .then(res => setGroups(res.data))
      .catch(err => console.error('Erreur chargement groupes :', err));
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Groupes Disponibles</h2>
      {groups.map(group => (
        <div key={group.orderId} className="border p-3 mb-2 rounded shadow">
          <p><strong>Produit :</strong> {group.productName}</p>
          <p><strong>Montant :</strong> {group.totalAmount} €</p>
          <p><strong>Adresse :</strong> {group.deliveryAddress}</p>
          <p><strong>Places :</strong> {group.currentGroupSize} / {group.maxGroupSize}</p>
          <p><strong>Produit :</strong> {group.productName || 'Non spécifié'}</p>

          <button
            className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            onClick={() => handleJoin(group.orderId)}
          >
            Rejoindre
          </button>
        </div>
      ))}
    </div>
  );
};

export default GroupList;
