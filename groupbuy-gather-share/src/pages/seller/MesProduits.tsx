// src/pages/seller/MesProduits.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const MesProduits = () => {
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/seller/my-products', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setProduits(res.data))
    .catch(err => console.error("Erreur lors du chargement des produits :", err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mes Produits</h2>
      {produits.length === 0 ? (
        <p className="text-gray-600">Aucun produit trouvé.</p>
      ) : (
        <ul className="list-disc pl-6 space-y-2">
          {produits.map(prod => (
            <li key={prod.id}>{prod.productName}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MesProduits;
