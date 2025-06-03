
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, MapPin } from 'lucide-react';
import axios from 'axios'; // en haut de ton fichier si pas déjà importé

const CreateNeed = () => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    quantity: '',
    budget: '',
    location: '',
    urgency: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
   

try {
  await axios.post('http://localhost:5000/api/needs', {
    productName: formData.productName,
    description: formData.description,
    quantity: parseInt(formData.quantity || '1') // valeur par défaut
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  toast({
    title: "✅ Besoin exprimé avec succès !",
    description: "Les vendeurs pourront maintenant créer des groupes basés sur votre besoin.",
  });

  navigate('/buyer/dashboard');
} catch (error: any) {
  toast({
    title: "❌ Erreur",
    description: error.response?.data?.message || "Une erreur est survenue.",
  });
} finally {
  setLoading(false);
}


    console.log('Besoin créé:', formData);
    
    toast({
      title: "Besoin exprimé avec succès !",
      description: "Les vendeurs pourront maintenant créer des groupes basés sur votre besoin.",
    });

    setLoading(false);
    navigate('/buyer/dashboard');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const categories = [
    'Électronique',
    'Informatique',
    'Audio & Vidéo',
    'Électroménager',
    'Mode & Accessoires',
    'Maison & Jardin',
    'Sport & Loisirs',
    'Automobile',
    'Santé & Beauté',
    'Autres'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exprimer un besoin
          </h1>
          <p className="text-gray-600">
            Décrivez le produit que vous souhaitez acheter. Les vendeurs pourront créer des groupes d'achat basés sur votre demande.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Nouveau besoin
                </CardTitle>
                <CardDescription>
                  Remplissez les informations ci-dessous pour exprimer votre besoin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="productName">Nom du produit *</Label>
                      <Input
                        id="productName"
                        value={formData.productName}
                        onChange={(e) => handleChange('productName', e.target.value)}
                        placeholder="Ex: iPhone 15 Pro, MacBook Air..."
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Catégorie *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleChange('category', value)} required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description détaillée *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Décrivez précisément le produit que vous recherchez (modèle, caractéristiques, couleur...)"
                      required
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="quantity">Quantité souhaitée</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleChange('quantity', e.target.value)}
                        placeholder="1"
                        min="1"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="budget">Budget maximum (€)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => handleChange('budget', e.target.value)}
                        placeholder="500"
                        min="0"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="location">Localisation</Label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleChange('location', e.target.value)}
                          placeholder="Paris, Lyon, Marseille..."
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="urgency">Urgence</Label>
                      <Select value={formData.urgency} onValueChange={(value) => handleChange('urgency', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Niveau d'urgence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Pas urgent</SelectItem>
                          <SelectItem value="medium">Modéré</SelectItem>
                          <SelectItem value="high">Urgent</SelectItem>
                          <SelectItem value="very-high">Très urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {loading ? 'Publication...' : 'Publier mon besoin'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/buyer/dashboard')}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with tips */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Conseils pour exprimer votre besoin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Soyez précis</h4>
                    <p className="text-gray-600">
                      Plus votre description est détaillée, plus les vendeurs pourront vous proposer exactement ce que vous cherchez.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Indiquez votre budget</h4>
                    <p className="text-gray-600">
                      Cela aide les vendeurs à proposer des produits dans votre gamme de prix.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Localisez-vous</h4>
                    <p className="text-gray-600">
                      Certains vendeurs proposent des livraisons locales ou des points de retrait.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Que se passe-t-il après ?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                    <p className="text-gray-600">Votre besoin est publié et visible par tous les vendeurs</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                    <p className="text-gray-600">Les vendeurs peuvent créer des groupes d'achat basés sur votre demande</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                    <p className="text-gray-600">Vous recevez une notification quand un groupe correspondant est créé</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNeed;
