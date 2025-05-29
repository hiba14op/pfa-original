import { useEffect, useState } from 'react';
import axios from 'axios';

const MesAvis = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/reviews/my', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      console.log("✅ Avis récupérés :", res.data); // 🔍 Affichage debug
      setReviews(res.data);
    })
    .catch(err => {
      console.error("❌ Erreur récupération des avis :", err);
    })
    .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes Avis</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : reviews.length === 0 ? (
        <div className="text-center text-gray-500 bg-white rounded-lg p-10">
          <div className="text-5xl mb-2">⭐</div>
          <p className="text-lg font-semibold">Aucun avis donné pour le moment</p>
          <p className="text-sm text-gray-400">Vos avis apparaîtront ici après vos achats</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="p-4 border rounded-lg shadow bg-white">
              <p className="font-semibold">Fournisseur ID : {review.supplierId}</p>
              <p className="text-yellow-500">Note : {review.rating} / 5</p>
              <p className="italic text-gray-700">"{review.comment}"</p>
              <p className="text-xs text-gray-400">
                Date : {new Date(review.creationDate).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesAvis;
