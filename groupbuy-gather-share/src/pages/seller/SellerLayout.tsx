import { useState } from 'react';
import { User, Package, Users, ShoppingCart, DollarSign, Settings, Plus, Eye, Edit, Trash2 } from 'lucide-react';

// Interface Vendeur
const SellerInterface = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop Dell XPS', price: 1299, stock: 5, status: 'active' },
    { id: 2, name: 'iPhone 15', price: 999, stock: 0, status: 'out_of_stock' }
  ]);

  const [orders, setOrders] = useState([
    { id: 1, customer: 'Client123', amount: 1299, status: 'pending', date: '2025-05-20' },
    { id: 2, customer: 'AcheteurXYZ', amount: 999, status: 'completed', date: '2025-05-18' }
  ]);

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: <User className="w-5 h-5" /> },
    { id: 'products', label: 'Mes Produits', icon: <Package className="w-5 h-5" /> },
    { id: 'groups', label: 'Groupes Créés', icon: <Users className="w-5 h-5" /> },
    { id: 'orders', label: 'Commandes', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'pricing', label: 'Tarifs Groupés', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings className="w-5 h-5" /> }
  ];

  const renderSellerContent = () => {
    switch(activeTab) {
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Mes Produits</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Ajouter un produit
              </button>
            </div>
            <div className="grid gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-gray-600 mt-1">${product.price}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? 'Actif' : 'Rupture de stock'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
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
              <h2 className="text-2xl font-bold text-gray-800">Groupes Créés</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
                <Plus className="w-4 h-4" />
                Créer un groupe
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun groupe créé pour le moment</p>
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Commandes</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${order.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'completed' ? 'Terminé' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800">Voir détails</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Tarifs Groupés</h2>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
                <Plus className="w-4 h-4" />
                Définir des tarifs
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center py-8">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun tarif groupé configuré</p>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Paramètres</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la boutique</label>
                  <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" defaultValue="Ma Boutique" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full p-3 border border-gray-300 rounded-lg" defaultValue="vendeur@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea className="w-full p-3 border border-gray-300 rounded-lg h-24" defaultValue="Boutique spécialisée en électronique"></textarea>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Tableau de Bord Vendeur</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Produits</p>
                    <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Commandes</p>
                    <p className="text-2xl font-bold text-green-600">{orders.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Revenus</p>
                    <p className="text-2xl font-bold text-purple-600">$2,298</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Groupes</p>
                    <p className="text-2xl font-bold text-orange-600">0</p>
                  </div>
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Commandes Récentes</h3>
                <div className="space-y-3">
                  {orders.slice(0, 3).map(order => (
                    <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-gray-600">${order.amount}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'completed' ? 'Terminé' : 'En attente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Produits Populaires</h3>
                <div className="space-y-3">
                  {products.slice(0, 3).map(product => (
                    <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">${product.price}</p>
                      </div>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                  ))}
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
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">Interface Vendeur</h1>
          </div>
          <nav className="mt-6">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 ${
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
          {renderSellerContent()}
        </div>
      </div>
    </div>
  );
};

export default SellerInterface;