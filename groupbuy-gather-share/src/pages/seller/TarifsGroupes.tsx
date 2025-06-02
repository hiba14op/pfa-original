import { useEffect, useState } from 'react';
import axios from 'axios';

const TarifsGroupes = () => {
  const [pricingData, setPricingData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/seller/pricing', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setPricingData(res.data))
    .catch(err => console.error("❌ Erreur chargement des tarifs groupés :", err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tarifs Groupés</h2>
      {pricingData.length === 0 ? (
        <p>Aucun tarif groupé disponible.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Produit</th>
              <th className="py-2 px-4 text-left">Participants</th>
              <th className="py-2 px-4 text-left">Prix (€)</th>
            </tr>
          </thead>
          <tbody>
            {pricingData.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">{item.productName}</td>
                <td className="py-2 px-4">{item.rangeLabel}</td>
                <td className="py-2 px-4">{item.price} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TarifsGroupes;
