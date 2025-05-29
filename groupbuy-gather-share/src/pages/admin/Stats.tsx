
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Calendar } from 'lucide-react';

const AdminStats = () => {
  // Mock data for statistics
  const overviewStats = [
    {
      title: 'Revenus totaux',
      value: '€247,350',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'Utilisateurs actifs',
      value: '2,543',
      change: '+8.2%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Groupes créés',
      value: '156',
      change: '+15.3%',
      trend: 'up',
      icon: ShoppingCart
    },
    {
      title: 'Taux de conversion',
      value: '68.4%',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp
    }
  ];

  const monthlyData = [
    { month: 'Jan', users: 180, groups: 12, revenue: 15420 },
    { month: 'Fév', users: 220, groups: 18, revenue: 18950 },
    { month: 'Mar', users: 280, groups: 25, revenue: 24680 },
    { month: 'Avr', users: 320, groups: 31, revenue: 28750 },
    { month: 'Mai', users: 380, groups: 38, revenue: 32100 },
    { month: 'Juin', users: 450, groups: 42, revenue: 38900 }
  ];

  const topCategories = [
    { name: 'Électronique', percentage: 35, sales: 1240 },
    { name: 'Informatique', percentage: 28, sales: 980 },
    { name: 'Audio & Vidéo', percentage: 15, sales: 520 },
    { name: 'Électroménager', percentage: 12, sales: 420 },
    { name: 'Gaming', percentage: 10, sales: 350 }
  ];

  const recentTransactions = [
    {
      id: '1',
      user: 'Marie L.',
      product: 'iPhone 15 Pro',
      amount: 999,
      date: '2024-01-08',
      status: 'completed'
    },
    {
      id: '2',
      user: 'Pierre M.',
      product: 'MacBook Air M2',
      amount: 1099,
      date: '2024-01-08',
      status: 'completed'
    },
    {
      id: '3',
      user: 'Sophie D.',
      product: 'Casque Sony',
      amount: 299,
      date: '2024-01-07',
      status: 'pending'
    },
    {
      id: '4',
      user: 'Lucas B.',
      product: 'iPad Pro',
      amount: 899,
      date: '2024-01-07',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-orange-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Statistiques et analyses
              </h1>
              <p className="text-gray-600">
                Vue d'ensemble des performances de la plateforme
              </p>
            </div>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Exporter le rapport
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                        )}
                        <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Icon className={`h-6 w-6 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Growth Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution mensuelle</CardTitle>
                <CardDescription>
                  Croissance des utilisateurs, groupes et revenus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{data.month} 2024</h4>
                        <Badge variant="outline">{data.revenue.toLocaleString()}€</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Utilisateurs</p>
                          <p className="font-semibold text-blue-600">+{data.users}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Groupes</p>
                          <p className="font-semibold text-green-600">{data.groups}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Revenus</p>
                          <p className="font-semibold text-purple-600">{data.revenue.toLocaleString()}€</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Categories */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Catégories populaires</CardTitle>
                <CardDescription>
                  Répartition des ventes par catégorie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCategories.map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm text-gray-600">{category.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{category.sales} ventes</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Transactions récentes</CardTitle>
              <CardDescription>
                Dernières transactions sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-sm">{transaction.user}</p>
                        <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                          {getStatusText(transaction.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{transaction.product}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{transaction.amount}€</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Métriques de performance</CardTitle>
              <CardDescription>
                Indicateurs clés de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Taux de remplissage des groupes</span>
                    <span className="text-sm font-bold text-green-600">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Satisfaction client</span>
                    <span className="text-sm font-bold text-blue-600">4.6/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Délai moyen de livraison</span>
                    <span className="text-sm font-bold text-purple-600">2.3 jours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '77%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Taux de retour</span>
                    <span className="text-sm font-bold text-orange-600">3.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
