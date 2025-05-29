
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Ban, CheckCircle, Eye, Mail, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  // Mock users data
  const users = [
    {
      id: '1',
      name: 'Marie Dupont',
      email: 'marie.dupont@email.com',
      role: 'buyer',
      status: 'active',
      joinedDate: '2024-01-05',
      lastActive: '2024-01-08',
      totalOrders: 5,
      totalSpent: 2450
    },
    {
      id: '2',
      name: 'Pierre Martin',
      email: 'pierre.martin@email.com',
      role: 'seller',
      status: 'active',
      joinedDate: '2023-12-15',
      lastActive: '2024-01-08',
      totalSales: 45,
      revenue: 12500
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      email: 'sophie.laurent@email.com',
      role: 'buyer',
      status: 'suspended',
      joinedDate: '2024-01-01',
      lastActive: '2024-01-06',
      totalOrders: 2,
      totalSpent: 890
    },
    {
      id: '4',
      name: 'Lucas Bernard',
      email: 'lucas.bernard@email.com',
      role: 'seller',
      status: 'active',
      joinedDate: '2023-11-20',
      lastActive: '2024-01-07',
      totalSales: 28,
      revenue: 8750
    },
    {
      id: '5',
      name: 'Emma Rousseau',
      email: 'emma.rousseau@email.com',
      role: 'buyer',
      status: 'active',
      joinedDate: '2024-01-03',
      lastActive: '2024-01-08',
      totalOrders: 8,
      totalSpent: 3200
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSuspendUser = (userId: string, userName: string) => {
    toast({
      title: "Utilisateur suspendu",
      description: `${userName} a été suspendu temporairement.`,
      variant: "destructive",
    });
  };

  const handleActivateUser = (userId: string, userName: string) => {
    toast({
      title: "Utilisateur activé",
      description: `${userName} a été réactivé avec succès.`,
    });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    toast({
      title: "Utilisateur supprimé",
      description: `Le compte de ${userName} a été supprimé définitivement.`,
      variant: "destructive",
    });
  };

  const handlePromoteUser = (userId: string, userName: string) => {
    toast({
      title: "Utilisateur promu",
      description: `${userName} a été promu administrateur.`,
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'seller': return 'bg-green-500';
      case 'buyer': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'seller': return 'Vendeur';
      case 'buyer': return 'Acheteur';
      default: return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'suspended': return 'bg-red-500';
      case 'pending': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'suspended': return 'Suspendu';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-600">
            Administrez les comptes utilisateurs de la plateforme
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-600">Total utilisateurs</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.role === 'buyer').length}
                </p>
                <p className="text-sm text-gray-600">Acheteurs</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.role === 'seller').length}
                </p>
                <p className="text-sm text-gray-600">Vendeurs</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.status === 'suspended').length}
                </p>
                <p className="text-sm text-gray-600">Suspendus</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="buyer">Acheteurs</SelectItem>
                  <SelectItem value="seller">Vendeurs</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="suspended">Suspendus</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>
              {filteredUsers.length} utilisateur(s) trouvé(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <Badge className={`${getRoleColor(user.role)} text-white`}>
                          {getRoleName(user.role)}
                        </Badge>
                        <Badge className={`${getStatusColor(user.status)} text-white`}>
                          {getStatusName(user.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>Inscrit le {new Date(user.joinedDate).toLocaleDateString('fr-FR')}</span>
                        <span>Dernière activité: {new Date(user.lastActive).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    
                    <div className="hidden md:block text-right">
                      {user.role === 'buyer' ? (
                        <div>
                          <p className="text-sm font-medium">{user.totalOrders} commandes</p>
                          <p className="text-xs text-gray-600">{user.totalSpent}€ dépensés</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium">{user.totalSales} ventes</p>
                          <p className="text-xs text-gray-600">{user.revenue}€ de CA</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.status === 'active' ? (
                          <DropdownMenuItem 
                            onClick={() => handleSuspendUser(user.id, user.name)}
                            className="text-red-600"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Suspendre
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => handleActivateUser(user.id, user.name)}
                            className="text-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activer
                          </DropdownMenuItem>
                        )}
                        
                        {user.role !== 'admin' && (
                          <DropdownMenuItem onClick={() => handlePromoteUser(user.id, user.name)}>
                            Promouvoir admin
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="text-red-600"
                        >
                          Supprimer définitivement
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun utilisateur trouvé
                </h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
