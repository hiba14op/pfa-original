import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  ShoppingCart,
  Users,
  Clock,
  Edit,
  Plus,
  List,
  Settings
} from "lucide-react";
import MesGroupes from "./MesGroupes";
import MesCommandes from "./OrderList"; // ⛳ fichier = OrderList.tsx
import MesBesoinsExprimes from "./MesBesoinsExprimes"; // ✅ bon nom
import CreateGroup from "./CreateGroup";
import ExprimerBesoin from "./CreateNeed"; // ⛳ fichier = CreateNeed.tsx
import BuyerProfile from "./SettingsPage"; // ⛳ fichier = SettingsPage.tsx


interface Stats {
  activeGroups: number;
  totalOrders: number;
  pendingNeeds: number;
}

const BuyerLayout = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [stats, setStats] = useState<Stats>({
    activeGroups: 0,
    totalOrders: 0,
    pendingNeeds: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);
  console.log("🔑 Token envoyé :", localStorage.getItem("token"));
  console.log("📊 Stats acheteur :", stats);

  const fetchStats = () => {
    axios
      .get("http://localhost:5000/api/buyer/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) =>
        console.error("Erreur chargement stats acheteur :", err)
      );
  };
const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

  const menuItems = [
    { id: "home", label: "Accueil", icon: <User className="w-5 h-5" /> },
    { id: "groups", label: "Mes Groupes", icon: <Users className="w-5 h-5" /> },
    { id: "orders", label: "Commandes", icon: <ShoppingCart className="w-5 h-5" /> },
    { id: "needs", label: "Mes Besoins Exprimés", icon: <List className="w-5 h-5" /> },
    { id: "createGroup", label: "Créer un Groupe", icon: <Plus className="w-5 h-5" /> },
    { id: "expressNeed", label: "Exprimer un Besoin", icon: <Edit className="w-5 h-5" /> },
    { id: "profile", label: "Profil", icon: <Settings className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "groups":
        return <MesGroupes />;
      case "orders":
        return <MesCommandes />;
      case "needs":
        return <MesBesoinsExprimes />;
      case "createGroup":
        return <CreateGroup />;
      case "expressNeed":
        return <ExprimerBesoin />;
      case "profile":
        return <BuyerProfile />;
      case "home":
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Tableau de Bord Acheteur
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Groupes actifs</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.activeGroups}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Commandes passées</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.totalOrders}
                    </p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Besoins en attente</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {stats.pendingNeeds}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">Interface Acheteur</h1>
          </div>
          <nav className="mt-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-700"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default BuyerLayout;
