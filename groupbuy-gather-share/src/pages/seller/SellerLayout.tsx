import { useEffect, useState } from 'react';
import axios from 'axios';
import CreateGroup from '@/pages/seller/CreateGroup';
import GroupList from './GroupList.tsx';
import MesProduits from '@/pages/seller/MesProduits';
import SellerOrders from '@/pages/seller/SellerOrders';
import SellerSettings from '@/pages/seller/SellerSettings';


import {
  User,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const SellerLayout = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 , groups: 0});

  useEffect(() => {
    fetchStats();
    fetchProducts();
  }, []);
  useEffect(() => {
  if (activeTab === "products") {
    axios.get("http://localhost:5000/api/seller/products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setProducts(res.data))
    .catch(err => console.error("❌ Erreur chargement produits vendeur :", err));
  }
}, [activeTab]);
const fetchProducts = () => {
  axios.get("http://localhost:5000/api/seller/products", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(res => setProducts(res.data))
  .catch(err => console.error("❌ Erreur chargement produits vendeur :", err));
};



  const fetchStats = () => {
    axios.get('http://localhost:5000/api/seller/stats', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setStats(res.data))
    .catch(err => console.error('Erreur lors du chargement des stats vendeur', err));
  };

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: <User className="w-5 h-5" /> },
    { id: 'products', label: 'Mes Produits', icon: <Package className="w-5 h-5" /> },
    { id: 'groups', label: 'Groupes Créés', icon: <Users className="w-5 h-5" /> },
    { id: 'orders', label: 'Commandes', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'pricing', label: 'Tarifs Groupés', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings className="w-5 h-5" /> },
    { id: 'createGroup', label: 'Créer un Groupe', icon: <Plus className="w-5 h-5" />, path: '/seller/create-group' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'createGroup':
          return <CreateGroup/>;
      case 'groups':
          return <GroupList />;
      case 'products':
        return <MesProduits />;
      case 'orders':
        return <SellerOrders />;
      case 'settings':
        return <SellerSettings />;
          

  case 'home':
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Tableau de Bord Vendeur</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {/* 🟦 Carte Produits */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Produits</p>
                <p className="text-2xl font-bold text-blue-600">{stats.products}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
  
          {/* 🟩 Carte Commandes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Commandes</p>
                <p className="text-2xl font-bold text-green-600">{stats.orders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
          </div>
  
          {/* 🟪 Carte Revenus */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Revenus</p>
                <p className="text-2xl font-bold text-purple-600">{stats.revenue} €</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
  
          {/* 🟣 Carte Groupes créés */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Groupes créés</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.groups}</p>
              </div>
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
    );
    
      default:
        return <div className="text-gray-600">Contenu à venir pour l'onglet : {activeTab}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">Interface Vendeur</h1>
          </div>
          <nav className="mt-6">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;

