import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';

const MesBesoinsExprimes = () => {
  const [needs, setNeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/needs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setNeeds(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des besoins exprimés:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNeeds();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes Besoins Exprimés</h1>
        {loading ? (
          <p>Chargement...</p>
        ) : needs.length === 0 ? (
          <p>Aucun besoin exprimé pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {needs.map((need) => (
              <div key={need.id} className="p-4 bg-white shadow rounded-lg">
                <h2 className="text-xl font-bold">{need.productName}</h2>
                <p className="text-gray-600">{need.description}</p>
                <p className="text-gray-500">Quantité : {need.quantity}</p>
                <p className="text-gray-500">Budget : {need.budget} €</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MesBesoinsExprimes;