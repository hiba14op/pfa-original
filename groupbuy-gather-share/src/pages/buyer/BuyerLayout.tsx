import React from "react";
import { User, ShoppingCart, MessageCircle, Users, Star, Plus, Settings, Edit, List } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const menuItems = [
  { id: "home", label: "Accueil", icon: <User className="w-5 h-5" />, path: "/buyer" },
  { id: "groups", label: "Mes Groupes", icon: <Users className="w-5 h-5" />, path: "/buyer/MesGroupes" },
  { id: "expressedNeeds", label: "Mes Besoins Exprimés", icon: <List className="w-5 h-5" />, path: "/buyer/mes-besoins-exprimes" }, // Remplacement ici
  { id: "orders", label: "Commandes", icon: <ShoppingCart className="w-5 h-5" />, path: "/buyer/orders" },
  { id: "reviews", label: "Mes Avis", icon: <Star className="w-5 h-5" />, path: "/buyer/reviews" },
  { id: "messages", label: "Messages", icon: <MessageCircle className="w-5 h-5" />, path: "/buyer/messages" },
  { id: "settings", label: "Paramètres", icon: <Settings className="w-5 h-5" />, path: "/buyer/settings" },
  { id: "createGroup", label: "Créer un Groupe", icon: <Plus className="w-5 h-5" />, path: "/buyer/create-group" },
  { id: "expressNeed", label: "Exprimer un Besoin", icon: <Edit className="w-5 h-5" />, path: "/buyer/needs" },
];

const BuyerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">Interface Acheteur</h1>
            <p className="text-sm text-gray-500 mt-1">Bienvenue !</p>
          </div>
          <nav className="mt-6">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                    isActive ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-700"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BuyerLayout;

