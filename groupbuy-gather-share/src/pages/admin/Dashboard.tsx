
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, ShoppingCart, TrendingUp, AlertTriangle, Eye, Ban, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  // Mock data
  const stats = {
    totalUsers: 2543,
    activeGroups: 45,
    totalTransactions: 15670,
    pendingComplaints: 3
  };

  const recentActivity = [
    {
      id: '1',
      type: 'user_registration',
      description: 'Nouvel utilisateur inscrit: marie.dupont@email.com',
      time: '2024-01-08 14:30',
      status: 'info'
    },
    {
      id: '2',
      type: 'group_created',
      description: 'Nouveau groupe créé: "Smartphone Samsung Galaxy S24"',
      time: '2024-01-08 13:15',
      status: 'success'
    },
    {
      id: '3',
      type: 'complaint',
      description: 'Nouvelle plainte: Produit non conforme',
      time: '2024-01-08 11:45',
      status: 'warning'
    },
    {
      id: '4',
      type: 'payment',
      description: 'Paiement réussi: 999€ - iPhone 15 Pro',
      time: '2024-01-08 10:20',
      status: 'success'
    }
  ];

  const pendingComplaints = [
    {
      id: '1',
      title: 'Produit non conforme',
      user: 'Marie L.',
      group: 'iPhone 15 Pro 128GB',
      date: '2024-01-08',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Livraison en retard',
      user: 'Pierre M.',
      group: 'MacBook Air M2',
      date: '2024-01-07',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Problème de paiement',
      user: 'Sophie D.',
      group: 'Casque Sony WH-1000XM5',
      date: '2024-01-06',
      priority: 'low'
    }
  ];

  const topPerformers = [
    {
      id: '1',
      name: 'TechStore Pro',
      type: 'seller',
      sales: 1250,
      rating: 4.9,
      groups: 15
    },
    {
      id: '2',
      name: 'ElectroMax',
      type: 'seller',
      sales: 980,
      rating: 4.7,
      groups: 12
    },
    {
      id: '3',
      name: 'GadgetWorld',
      type: 'seller',
      sales: 756,
      rating: 4.8,
      groups: 10
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <Users className="h-4 w-4" />;
      case 'group_created': return <ShoppingCart className="h-4 w-4" />;
      case 'complaint': return <AlertTriangle className="h-4 w-4" />;
      case 'payment': return <TrendingUp className="h-4 w-4" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Administration
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de la plateforme GroupBuy
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs totaux</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Groupes actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeGroups}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Plaintes en attente</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingComplaints}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>
                  Dernières actions sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.status)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Complaints */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Plaintes en attente</CardTitle>
                    <CardDescription>
                      Réclamations nécessitant votre attention
                    </CardDescription>
                  </div>
                  <Link to="/admin/complaints">
                    <Button variant="outline" size="sm">
                      Voir toutes
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingComplaints.map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{complaint.title}</h4>
                          <Badge className={`${getPriorityColor(complaint.priority)} text-white`}>
                            {getPriorityText(complaint.priority)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Utilisateur: {complaint.user} • Groupe: {complaint.group}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(complaint.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Résoudre
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/admin/users">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Gérer les utilisateurs
                  </Button>
                </Link>
                <Link to="/admin/stats">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Voir les statistiques
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Ban className="h-4 w-4 mr-2" />
                  Modérer le contenu
                </Button>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Meilleurs vendeurs</CardTitle>
                <CardDescription>
                  Vendeurs les plus performants ce mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <div key={performer.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{performer.name}</p>
                          <p className="text-xs text-gray-600">
                            {performer.sales} ventes • {performer.rating}/5
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {performer.groups} groupes
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>État du système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Serveur principal</span>
                  <Badge className="bg-green-500 text-white">En ligne</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Base de données</span>
                  <Badge className="bg-green-500 text-white">Opérationnelle</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Paiements</span>
                  <Badge className="bg-green-500 text-white">Actifs</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Notifications</span>
                  <Badge className="bg-orange-500 text-white">Maintenance</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
