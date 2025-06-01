import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // ✅ Ajout du contexte d'authentification

const Groups = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [groups, setGroups] = useState<any[]>([]);
  const { isAuthenticated } = useAuth(); // ✅ Vérifie si l'utilisateur est connecté

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/grouporder/open');
        setGroups(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des groupes:", error);
      }
    };

    if (isAuthenticated) {
      fetchGroups();
    }
  }, [isAuthenticated]);

  const filteredGroups = groups.filter(group => {
    const title = group.title || '';
    const description = group.description || '';
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || group.category === category;
    return matchesSearch && matchesCategory;
  });

  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {!isAuthenticated ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Accès restreint</h2>
          <p className="text-gray-500 mb-6">Veuillez vous connecter pour voir les groupes d'achat disponibles.</p>
          <Link to="/login">
            <Button className="bg-indigo-600 hover:bg-indigo-700">Se connecter</Button>
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Groupes d'achat disponibles</h1>
            <p className="text-gray-600 mb-6">Rejoignez un groupe et économisez sur vos achats favoris</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="Électronique">Électronique</SelectItem>
                  <SelectItem value="Audio">Audio</SelectItem>
                  <SelectItem value="Électroménager">Électroménager</SelectItem>
                  <SelectItem value="Mode">Mode</SelectItem>
                  <SelectItem value="Maison">Maison</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularité</SelectItem>
                  <SelectItem value="discount">Remise</SelectItem>
                  <SelectItem value="ending-soon">Fin prochaine</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card key={group.orderId} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={
                      group.image && group.image.trim() !== '' 
                        ? group.image 
                        : 'https://via.placeholder.com/300'
                    } 
                    alt={group.title || 'Image groupe'}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                    -{group.discount || 0}%
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{group.title}</CardTitle>
                      <CardDescription className="text-sm">{group.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit">{group.category || 'Autre'}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{group.totalAmount}€</p>
                      <p className="text-sm text-gray-500 line-through">{group.originalPrice || ''}€</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Vendeur</p>
                      <p className="font-medium">{group.supplierName || 'Non spécifié'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {group.currentGroupSize}/{group.maxGroupSize} participants
                      </span>
                      <span className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {getDaysRemaining(group.endDate || '2024-12-31') > 0 
                          ? `${getDaysRemaining(group.endDate)}j restants` 
                          : 'Expiré'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(group.currentGroupSize, group.maxGroupSize)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/group-list/${parseInt(group.orderId)}`} className="flex-1">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Voir les détails
                      </Button>
                    </Link>
                
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun groupe trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche ou créez un nouveau groupe.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Groups;
