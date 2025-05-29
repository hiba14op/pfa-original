
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingCart, Users, Clock, Plus, TrendingUp, Package } from 'lucide-react';

const BuyerDashboard = () => {
  // Mock data
  const myGroups = [
    {
      id: '1',
      title: 'iPhone 15 Pro 128GB',
      status: 'active',
      participants: 45,
      maxParticipants: 50,
      currentPrice: 999,
      endDate: '2024-01-15',
      progress: 90
    },
    {
      id: '2',
      title: 'MacBook Air M2',
      status: 'completed',
      participants: 40,
      maxParticipants: 40,
      currentPrice: 1099,
      endDate: '2024-01-10',
      progress: 100
    }
  ];

  const recentActivity = [
    {
      id: '1',
      action: 'Rejoint le groupe',
      item: 'iPhone 15 Pro 128GB',
      date: '2024-01-08',
      type: 'join'
    },
    {
      id: '2',
      action: 'Commande livrée',
      item: 'MacBook Air M2',
      date: '2024-01-05',
      type: 'delivery'
    },
    {
      id: '3',
      action: 'Paiement effectué',
      item: 'MacBook Air M2',
      date: '2024-01-03',
      type: 'payment'
    }
  ];

  const recommendations = [
    {
      id: '3',
      title: 'Casque Sony WH-1000XM5',
      discount: 25,
      participants: 28,
      maxParticipants: 30
    },
    {
      id: '4',
      title: 'Robot Aspirateur Roomba',
      discount: 21,
      participants: 18,
      maxParticipants: 25
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'completed': return 'Terminé';
      case 'expired': return 'Expiré';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord Acheteur
          </h1>
          <p className="text-gray-600">
            Gérez vos groupes d'achat et découvrez de nouvelles opportunités
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Groupes actifs</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
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
                  <p className="text-sm font-medium text-gray-600">Commandes</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Économies totales</p>
                  <p className="text-2xl font-bold text-green-600">847€</p>
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
                  <p className="text-sm font-medium text-gray-600">Besoins exprimés</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Plus className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Groups */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Mes groupes</CardTitle>
                    <CardDescription>
                      Suivez l'évolution de vos participations
                    </CardDescription>
                  </div>
                  <Link to="/groups">
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Rejoindre un groupe
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myGroups.map((group) => (
                    <div key={group.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{group.title}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge className={`${getStatusColor(group.status)} text-white`}>
                              {getStatusText(group.status)}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {group.currentPrice}€
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {group.participants}/{group.maxParticipants} participants
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Fin le {new Date(group.endDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${group.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link to={`/groups/${group.id}`}>
                          <Button variant="outline" size="sm">
                            Voir les détails
                          </Button>
                        </Link>
                        {group.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            Donner un avis
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>
                  Vos dernières actions sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'join' ? 'bg-blue-500' :
                        activity.type === 'delivery' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.action}</span> : {activity.item}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString('fr-FR')}
                        </p>
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
                <Link to="/buyer/needs/create">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Exprimer un besoin
                  </Button>
                </Link>
                <Link to="/groups">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Parcourir les groupes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
                <CardDescription>
                  Groupes qui pourraient vous intéresser
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">{item.title}</h4>
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>-{item.discount}% de remise</span>
                        <span>{item.participants}/{item.maxParticipants}</span>
                      </div>
                      <Link to={`/groups/${item.id}`}>
                        <Button size="sm" className="w-full mt-2">
                          Rejoindre
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
