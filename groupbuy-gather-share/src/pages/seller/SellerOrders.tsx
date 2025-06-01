import { useEffect, useState } from "react";
import axios from "axios";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/seller/orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setOrders(res.data))
    .catch(err => console.error("Erreur chargement commandes :", err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Commandes des groupes</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-2 px-4 text-left">Produit</th>
            <th className="py-2 px-4 text-left">Montant</th>
            <th className="py-2 px-4 text-left">Statut</th>
            <th className="py-2 px-4 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{order.productName}</td>
              <td className="py-2 px-4">{order.amount} €</td>
              <td className="py-2 px-4 capitalize">{order.status}</td>
              <td className="py-2 px-4">{order.orderDate?.split("T")[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerOrders;
