import { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token'); // 🔐 Ton token JWT
      const response = await axios.post(
        'http://localhost:5000/api/payments',
        { orderId, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage(response.data.message);
    } catch (error: any) {
      console.error(error);
      setMessage("❌ Erreur lors du paiement.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Paiement</h2>
      <input
        type="text"
        placeholder="ID de la commande"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        placeholder="Montant"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Valider le paiement
      </button>
      {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
    </div>
  );
};

export default PaymentForm;
