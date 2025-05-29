import React, { useState } from 'react';
import { User, ShoppingCart, MessageCircle, Users, Star, Search, Plus, Edit, Trash2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom'; // ✅ pour la redirection vers la page de paiement
import PaymentForm from './PaymentForm';
import { Routes, Route } from 'react-router-dom';
import CreateNeed from './CreateNeed';
import GroupList from './GroupList';
import CreateGroup from './CreateGroup';
import OrderList from './OrderList';
import MesAvis from './mesAvis'; // ✅ adapte le chemin si nécessaire
import { useEffect } from 'react';
import axios from 'axios';



const BuyerLayout = () => {
    const [activeTab, setActiveTab] = useState('home');
  return (
    <Routes>
      <Route index element={<BuyerInterface />} />
      <Route path="needs/create" element={<CreateNeed />} />
      <Route path="payment/:orderId" element={<PaymentForm />} /> {/* ✅ cette ligne est nécessaire */}
      <Route path="orders" element={<OrderList />} />


    </Routes>
  );
};
export default BuyerLayout;

const BuyerInterface = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [savings, setSavings] = useState<number>(0);

  const [groups, setGroups] = useState<any[]>([]);

  const [needs, setNeeds] = useState<any[]>([]);

  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
  fetchData();
}, []);
const fetchData = () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  axios.get(`http://localhost:5000/api/needs?userId=${userId}`)
    .then(res => setNeeds(res.data))
    .catch(err => console.error('Erreur besoins', err));

  axios.get(`http://localhost:5000/api/groups/joined?userId=${userId}`)
    .then(res => setGroups(res.data))
    .catch(err => console.error('Erreur groupes', err));

  axios.get(`http://localhost:5000/api/orders?userId=${userId}`)
    .then(res => setOrders(res.data))
    .catch(err => console.error('Erreur commandes', err));

  axios.get(`http://localhost:5000/api/savings?userId=${userId}`)
    .then(res => setSavings(res.data.total || 0))
    .catch(err => console.error('Erreur économies', err));
};



  const menuItems = [
    { id: 'home', label: 'Accueil', icon: <User className="w-5 h-5" /> },
    { id: 'needs', label: 'Mes Besoins', icon: <Search className="w-5 h-5" /> },
    { id: 'groups', label: 'Mes Groupes', icon: <Users className="w-5 h-5" /> },
    { id: 'orders', label: 'Commandes', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'reviews', label: 'Mes Avis', icon: <Star className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageCircle className="w-5 h-5" /> },

    { id: 'settings', label: 'Paramètres', icon: <Settings className="w-5 h-5" /> },
    { id: 'createGroup', label: 'Créer un Groupe', icon: <Plus className="w-5 h-5" /> },

  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'needs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Mes Besoins</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Exprimer un besoin
              </button>
            </div>
            <div className="grid gap-4">
              {needs.map(need => (
                <div key={need.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{need.title}</h3>
                      <p className="text-gray-600 mt-1">{need.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                          need.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {need.status === 'active' ? 'Actif' : 'Terminé'}
                        </span>
                        <span className="text-sm text-gray-500">Publié le {need.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'groups':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Mes Groupes</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
                <Search className="w-4 h-4" />
                Parcourir les groupes
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map(group => (
                <div key={group.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">{group.name}</h3>
                  <p className="text-gray-600 mb-4">{group.members} membres actifs</p>
                  <div className="flex justify-between items-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Réduction: {group.discount}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                      Voir détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

   case 'orders':
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Mes Commandes</h2>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{order.product}</h3>
                  <p className="text-gray-600 mt-1">Groupe: {order.group}</p>
                  <p className="text-sm text-gray-500 mt-1">Commandé le {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">{order.price}</p>
                  <div className="mt-2 flex gap-2 items-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      order.status === 'Livré' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                    {order.status !== 'Livré' && (
                      <Link to={`/buyer/payment/${order.id}`}>
                        <button className="ml-2 text-sm text-blue-600 hover:underline">
                          💳 Payer
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center py-8">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune commande pour le moment</p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Explorer les offres
            </button>
          </div>
        </div>
      )}
    </div>
  );
      case 'joinGroup':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Groupes Disponibles</h2>
            <GroupList  fetchData={fetchData} />
          </div>
  );
     case 'createGroup':
      
        return <CreateGroup />;

case 'reviews':
  return <MesAvis />;
// Ajoutez ici d'autres cas si besoin

      case 'messages':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center py-8">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucune conversation en cours</p>
                <p className="text-sm text-gray-400 mt-2">Communiquez avec les membres de vos groupes</p>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Paramètres du Compte</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      defaultValue="Acheteur123" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      defaultValue="acheteur@email.com" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Préférences de notification</label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3 w-4 h-4 text-blue-600" defaultChecked />
                      <span className="text-sm text-gray-700">Notifications par email</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3 w-4 h-4 text-blue-600" defaultChecked />
                      <span className="text-sm text-gray-700">Alertes de nouveaux groupes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3 w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Promotions et offres spéciales</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Sauvegarder
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Tableau de Bord Acheteur</h2>
              <div className="text-sm text-gray-500">
                Dernière connexion: {new Date().toLocaleDateString('fr-FR')}
              </div>
            </div>
            
            {/* Statistiques principales */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Besoins Actifs</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {needs.filter(need => need.status === 'active').length}
                    </p>
                  </div>
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Groupes Rejoints</p>
                    <p className="text-2xl font-bold text-green-600">{groups.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Commandes</p>
                    <p className="text-2xl font-bold text-purple-600">{orders.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Économies</p>
                    <p className="text-2xl font-bold text-yellow-600">{savings}€</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab('needs')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <Search className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Exprimer un besoin</p>
                </button>
                <button 
                  onClick={() => setActiveTab('joinGroup')}

                  className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Rejoindre un groupe</p>
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Voir commandes</p>
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
                >
                  <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Donner un avis</p>
                </button>
              </div>
            </div>

            {/* Activité récente */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Mes Besoins Récents</h3>
                <div className="space-y-3">
                  {needs.slice(0, 3).map(need => (
                    <div key={need.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{need.title}</p>
                        <p className="text-sm text-gray-600">{need.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        need.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {need.status === 'active' ? 'Actif' : 'Terminé'}
                      </span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('needs')}
                  className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Voir tous mes besoins →
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Mes Groupes</h3>
                <div className="space-y-3">
                  {groups.slice(0, 3).map(group => (
                    <div key={group.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{group.name}</p>
                        <p className="text-sm text-gray-600">{group.members} membres</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        -{group.discount}
                      </span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('groups')}
                  className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Parcourir tous les groupes →
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

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
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
