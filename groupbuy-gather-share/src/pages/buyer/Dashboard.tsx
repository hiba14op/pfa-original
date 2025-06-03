import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, ShoppingCart, Clock } from "lucide-react";

interface Stats {
  activeGroups: number;
  totalOrders: number;
  pendingNeeds: number;
}

const BuyerDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    activeGroups: 0,
    totalOrders: 0,
    pendingNeeds: 0,
  });

  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentNeeds, setRecentNeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      console.log("USER ID DEBUG:", userId);

      if (!token || !userId) {
        alert("Vous devez être connecté pour accéder au tableau de bord.");
        navigate("/login");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [statsRes, groupsRes, ordersRes, needsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/buyer/dashboard`, config),
        
        axios.get(`http://localhost:5000/api/buyer/group/joined?userId=${userId}`, config),
        axios.get(`http://localhost:5000/api/buyer/orders?userId=${userId}`, config),
        axios.get(`http://localhost:5000/api/buyer/needs?userId=${userId}`, config),
      ]);
      console.log("📊 Données dashboard :", statsRes.data); // 👈 AJOUTE ÇA
      setStats(statsRes.data);
      setMyGroups(groupsRes.data);
      setRecentOrders(ordersRes.data);
      setRecentNeeds(needsRes.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
      alert("Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [navigate]);


  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            
             tableau de bord Acheteur
          </h1>
          <p className="text-gray-600">
            Gérez vos besoins, commandes et groupes d'achat
          </p>
        </div>

  {/* Statistiques Acheteur */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <Card>
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">
          Groupes actifs
        </p>
        <p className="text-2xl font-bold text-gray-900">
          {stats.activeGroups}
        </p>
      </div>
      <div className="bg-blue-100 p-3 rounded-full">
        <Users className="h-6 w-6 text-blue-600" />
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">
          Commandes passées
        </p>
        <p className="text-2xl font-bold text-gray-900">
          {stats.totalOrders}
        </p>
      </div>
      <div className="bg-green-100 p-3 rounded-full">
        <ShoppingCart className="h-6 w-6 text-green-600" />
      </div>
    </CardContent>
  </Card>


  <Card>
  <CardHeader>
    <CardTitle>Besoins récents</CardTitle>
    <CardDescription>Vos besoins récemment exprimés</CardDescription>
  </CardHeader>
  <CardContent>
    {recentNeeds.length === 0 ? (
      <p className="text-gray-500 text-sm">Aucun besoin exprimé.</p>
    ) : (
      recentNeeds.map((need) => (
        <div key={need.needId} className="mb-4 p-4 border rounded-lg">
          <h4 className="text-sm font-semibold">
            {need.productName}
          </h4>
          <p className="text-xs text-gray-600">
            {need.description}
          </p>
          <p className="text-xs text-gray-500">
            Quantité : {need.quantity}
          </p>
          <p className="text-xs text-gray-400 italic">
            Date : {new Date(need.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))
    )}
  </CardContent>
</Card>

</div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Groupes */}
            <Card>
              <CardHeader>
                <CardTitle>Mes groupes d'achat</CardTitle>
                <CardDescription>
                  Gérez vos groupes actifs et terminés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myGroups.map((group) => (
                  <div key={group.orderId}
                  className="mb-4 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold">
                      {group.productName || "Nom du produit non défini"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Adresse : {group.deliveryAddress}
                    </p>
                    <Link to={`/groups/${group.orderId}`}>
                      <button className="text-blue-600">Voir détails</button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Commandes */}
            <Card>
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>Vos dernières commandes</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.map((order) => (
                  <div key={order.id} className="mb-4 p-4 border rounded-lg">
                    <p className="font-medium">{order.productName}</p>
                    <p className="text-sm text-gray-600">
                      Montant : {order.totalAmount}€
                    </p>
                    <p className="text-sm text-gray-600">
                      Statut : {order.status}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Besoins récents */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Besoins récents</CardTitle>
                <CardDescription>
                  Vos besoins récemment exprimés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentNeeds.map((need) => (
                  <div key={need.id} className="mb-4 p-4 border rounded-lg">
                    <h4 className="text-sm font-semibold">
                      {need.productName}
                    </h4>
                    <p className="text-xs text-gray-600">{need.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

};

export default BuyerDashboard;
