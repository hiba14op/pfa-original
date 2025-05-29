// src/pages/seller/Needs.tsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  Search,
  Users,
  MapPin,
  Plus,
} from 'lucide-react'

interface Need {
  id: string
  product: string
  description: string
  category: string
  urgency: 'low' | 'medium' | 'high'
  budget: number
  interested: number
  location: string
  author: string
  date: string
}

export default function Needs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')
  const [needs, setNeeds] = useState<Need[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const token = localStorage.getItem('token')
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const response = await axios.get(
          'http://localhost:5000/api/seller/needs',
          config
        )
        setNeeds(response.data.needs || [])
      } catch (error) {
        toast({
          title: 'Erreur',
          description: "Impossible de charger les besoins",
          variant: 'destructive',
        })
      }
    }

    fetchNeeds()
  }, [toast])

  const filteredNeeds = needs.filter((need) => {
    const text = searchTerm.toLowerCase()
    const matchesSearch =
      need.product.toLowerCase().includes(text) ||
      need.description.toLowerCase().includes(text)
    const matchesCategory = category === 'all' || need.category === category
    return matchesSearch && matchesCategory
  })

  const handleCreateGroup = async (needId: string, productName: string) => {
    try {
      const token = localStorage.getItem('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      await axios.post(
        `http://localhost:5000/api/seller/groups/from-need/${needId}`,
        {},
        config
      )
      toast({
        title: 'Groupe créé !',
        description: `Vous avez créé un groupe pour "${productName}". Les personnes intéressées seront notifiées.`,
      })
    } catch {
      toast({
        title: 'Erreur',
        description: "Impossible de créer un groupe",
        variant: 'destructive',
      })
    }
  }

  const getUrgencyColor = (u: string) =>
    u === 'high' ? 'bg-red-500' :
    u === 'medium' ? 'bg-orange-500' :
    u === 'low' ? 'bg-green-500' : 'bg-gray-500'

  const getUrgencyText = (u: string) =>
    u === 'high' ? 'Urgent' :
    u === 'medium' ? 'Modéré' :
    u === 'low' ? 'Pas urgent' : u

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Besoins exprimés
          </h1>
          <p className="text-gray-600">
            Découvrez les produits que les acheteurs recherchent et créez des groupes d'achat
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un besoin..."
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
              <SelectItem value="Gaming">Gaming</SelectItem>
              <SelectItem value="Électroménager">Électroménager</SelectItem>
              <SelectItem value="Mode">Mode</SelectItem>
              <SelectItem value="Maison">Maison</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNeeds.map((need) => (
            <Card key={need.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{need.product}</CardTitle>
                  <Badge className={`${getUrgencyColor(need.urgency)} text-white`}>
                    {getUrgencyText(need.urgency)}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{need.category}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {need.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Budget max.</span>
                    <span className="font-semibold text-green-600">
                      {need.budget}€
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      Intéressés
                    </span>
                    <span className="font-semibold">{need.interested}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      Localisation
                    </span>
                    <span className="font-medium">{need.location}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span>Demandé par {need.author}</span>
                    <span>{new Date(need.date).toLocaleDateString('fr-FR')}</span>
                  </div>

                  <Button
                    onClick={() => handleCreateGroup(need.id, need.product)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un groupe
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNeeds.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun besoin trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
