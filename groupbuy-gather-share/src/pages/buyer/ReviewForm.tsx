import { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ supplierId }: { supplierId: number }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const submitReview = async () => {
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        supplierId,
        rating,
        comment
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccessMessage("✅ Avis envoyé avec succès !");
      setRating(5);
      setComment('');
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de l'avis :", error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md mt-6">
      <h3 className="font-bold text-lg mb-2">Laisser un avis</h3>

      {successMessage && (
        <div className="mb-4 text-green-600">{successMessage}</div>
      )}

      <label className="block mb-1 font-medium">Note</label>
      <select
        value={rating}
        onChange={e => setRating(Number(e.target.value))}
        className="mb-3 p-2 border rounded w-full"
      >
        {[1, 2, 3, 4, 5].map(n => (
          <option key={n} value={n}>{n} étoile{n > 1 && 's'}</option>
        ))}
      </select>

      <label className="block mb-1 font-medium">Commentaire</label>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Votre commentaire"
        className="w-full p-2 border rounded mb-3"
        rows={4}
      />

      <button
        onClick={submitReview}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Envoyer
      </button>
    </div>
  );
};

export default ReviewForm;
