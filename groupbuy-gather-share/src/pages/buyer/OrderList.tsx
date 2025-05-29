import { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/my', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setOrders(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes Commandes</h1>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className="p-4 border rounded-lg shadow bg-white">
            <h2 className="font-semibold text-lg">{order.productName}</h2>
            <p>Montant : {order.totalAmount} €</p>
            <p>Adresse : {order.deliveryAddress}</p>
            <p>Status : {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
