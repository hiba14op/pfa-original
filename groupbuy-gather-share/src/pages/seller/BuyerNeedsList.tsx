import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BuyerNeedsList = () => {
  const [needs, setNeeds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/seller/needs');
        setNeeds(res.data);
      } catch (err) {
        console.error("Erreur chargement des besoins :", err);
      }
    };
    fetchNeeds();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Besoins exprimés par les acheteurs</h2>
      {needs.length === 0 ? (
        <p>Aucun besoin pour le moment.</p>
      ) : (
        needs.map(need => (
          <div key={need.needId} className="bg-white border p-3 mb-3 rounded shadow">
            <p><strong>Produit :</strong> {need.productName}</p>
            <p><strong>Description :</strong> {need.description}</p>
            <p><strong>Quantité :</strong> {need.quantity}</p>
            <p><strong>Acheteur :</strong> {need.buyerName}</p>
            <button
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
              onClick={() => navigate(`/seller/create-group?needId=${need.needId}`)}
            >
              Créer une offre
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default BuyerNeedsList;
