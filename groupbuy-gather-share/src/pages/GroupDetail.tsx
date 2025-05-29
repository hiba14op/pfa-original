import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Users, Clock, TrendingDown, Star, MapPin, Truck, Shield } from 'lucide-react';

const GroupDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [group, setGroup] = useState<any | null>(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/grouporders/${id}`);
        setGroup(response.data);
      } catch (err) {
        toast({
          title: 'Erreur',
          description: "Impossible de charger les données du groupe",
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id, toast]);

  const handleJoinGroup = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour rejoindre un groupe.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/grouporders/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJoined(true);
      toast({
        title: "Groupe rejoint !",
        description: "Vous avez rejoint le groupe avec succès. Vous recevrez une notification quand le groupe sera complet."
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || "Une erreur s'est produite",
        variant: 'destructive'
      });
    }
  };

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

  if (loading || !group) {
    return <div className="text-center py-10">Chargement en cours...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={group.image && group.image.trim() !== '' ? group.image : 'https://via.placeholder.com/600x400?text=Image+non+disponible'} 
                    alt={group.title || 'Image groupe'}
                    className="w-full h-80 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 right-4 bg-green-500 text-white text-lg px-3 py-1">
                    -{group.discount}%
                  </Badge>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.title}</h1>
                      <Badge variant="outline">{group.category}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-600">{group.currentPrice}€</p>
                      <p className="text-lg text-gray-500 line-through">{group.originalPrice}€</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{group.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>À propos du vendeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-indigo-600 text-white text-xl">
                      {group.seller?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{group.seller?.name}</h3>
                      {group.seller?.verified && (
                        <Badge className="bg-blue-500 text-white">
                          <Shield className="h-3 w-3 mr-1" /> Vérifié
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {group.seller?.rating}/5
                      </div>
                      <span>{group.seller?.sales} ventes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rejoindre le groupe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">
                    {group.currentGroupSize}/{group.maxGroupSize}
                  </div>
                  <p className="text-sm text-gray-600">participants</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(group.currentGroupSize, group.maxGroupSize)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {getDaysRemaining(group.endDate)} jours restants
                </div>

                {joined ? (
                  <Button disabled className="w-full bg-green-600">
                    <Users className="h-4 w-4 mr-2" /> Groupe rejoint
                  </Button>
                ) : (
                  <Button 
                    onClick={handleJoinGroup}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={group.currentGroupSize >= group.maxGroupSize}
                  >
                    {group.currentGroupSize >= group.maxGroupSize ? 'Groupe complet' : 'Rejoindre le groupe'}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" /> Livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Frais de port</span>
                  <span className="text-green-600 font-medium">
                    {group.shipping?.free ? 'Gratuite' : 'Payante'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Délai estimé</span>
                  <span>{group.shipping?.estimated}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <MapPin className="h-4 w-4 inline mr-1" /> Zones de livraison:
                  </p>
                  <ul className="text-sm text-gray-600 mt-1">
                    {group.shipping?.locations?.map((location: string, index: number) => (
                      <li key={index}>• {location}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2" /> Vos économies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {group.originalPrice - group.currentPrice}€
                  </div>
                  <p className="text-sm text-gray-600">d'économies par rapport au prix original</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
