// src/pages/seller/CreateGroup.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Plus, Minus } from 'lucide-react'

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
  'Gaming',
  'Autres',
]

export default function CreateGroup() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    originalPrice: '',
    minParticipants: '',
    maxParticipants: '',
    endDate: '',
    features: [''],
  })
  const [priceBreakdown, setPriceBreakdown] = useState([
    { participants: '1-10', price: '' },
    { participants: '11-25', price: '' },
    { participants: '26-50', price: '' },
  ])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFeatureChange = (idx: number, value: string) => {
    const features = [...formData.features]
    features[idx] = value
    setFormData(prev => ({ ...prev, features }))
  }

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))
  }

  const removeFeature = (idx: number) => {
    if (formData.features.length > 1) {
      const features = prev => prev.features.filter((_, i) => i !== idx)
      setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))
    }
  }

  const handlePriceChange = (idx: number, price: string) => {
    const tiers = [...priceBreakdown]
    tiers[idx].price = price
    setPriceBreakdown(tiers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const payload = {
        ...formData,
        priceBreakdown,
      }
      await axios.post(
        'http://localhost:5000/api/seller/groups',
        payload,
        config
      )
      toast({
        title: 'Groupe créé !',
        description:
          "Votre groupe d'achat est maintenant visible par les acheteurs.",
      })
      navigate('/seller')
    } catch (err) {
      console.error(err)
      toast({
        title: 'Erreur',
        description: "La création du groupe a échoué.",
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Créer un groupe d'achat</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nom du produit</Label>
                <Input
                  value={formData.title}
                  onChange={e =>
                    handleChange('title', e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={val =>
                    handleChange('category', val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prix de référence (€)</Label>
                <Input
                  type="number"
                  value={formData.originalPrice}
                  onChange={e =>
                    handleChange('originalPrice', e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Participants (min - max)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={formData.minParticipants}
                    onChange={e =>
                      handleChange('minParticipants', e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={formData.maxParticipants}
                    onChange={e =>
                      handleChange('maxParticipants', e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={e =>
                    handleChange('endDate', e.target.value)
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Caractéristiques */}
          <Card>
            <CardHeader>
              <CardTitle>Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.features.map((feat, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={feat}
                    onChange={e =>
                      handleFeatureChange(idx, e.target.value)
                    }
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeFeature(idx)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter une caractéristique
              </Button>
            </CardContent>
          </Card>

          {/* Tarification progressive */}
          <Card>
            <CardHeader>
              <CardTitle>Tarification progressive</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {priceBreakdown.map((tier, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <Label className="w-24">
                    {tier.participants}
                  </Label>
                  <Input
                    type="number"
                    value={tier.price}
                    onChange={e =>
                      handlePriceChange(idx, e.target.value)
                    }
                    required
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? 'Création en cours...' : 'Créer le groupe'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/seller')}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
