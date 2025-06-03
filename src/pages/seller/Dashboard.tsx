// src/pages/seller/Dashboard.tsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import {
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

interface Stats {
  activeGroups: number
  totalSales: number
  revenue: number
  pendingOrders: number
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<Stats>({
    activeGroups: 0,
    totalSales: 0,
    revenue: 0,
    pendingOrders: 0,
  })
  const [mesGroupes, setMesGroupes] = useState<any[]>([])
  const [pendingOrders, setPendingOrders] = useState<any[]>([])
  const [recentNeeds, setRecentNeeds] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const config = { headers: { Authorization: `Bearer ${token}` } }

        // 1. Stats (counts + revenue)
        const statsRes = await axios.get(
          'http://localhost:5000/api/seller/dashboard',
          config
        )
        setStats(statsRes.data)

        // 2. Mes groupes
        const groupsRes = await axios.get(
          'http://localhost:5000/api/seller/groups',
          config
        )
         setMesGroupes(groupsRes.data.groups || [])

        // 3. Commandes en attente
        const ordersRes = await axios.get(
          'http://localhost:5000/api/seller/orders?status=pending',
          config
        )
        setPendingOrders(ordersRes.data.orders || [])

        // 4. Besoins récents
        const needsRes = await axios.get(
          'http://localhost:5000/api/seller/needs/recent',
          config
        )
        setRecentNeeds(needsRes.data.needs || [])
      } catch (error) {
        console.error('Erreur dashboard vendeur :', error)
      }
    }

    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      case 'expired':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif'
      case 'completed':
        return 'Terminé'
      case 'expired':
        return 'Expiré'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord Vendeur
          </h1>
          <p className="text-gray-600">
            Gérez vos groupes d'achat et développez votre activité
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Groupes actifs
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeGroups}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ventes totales
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSales}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Chiffre d'affaires
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.revenue.toLocaleString()}€
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Commandes en attente
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Mes groupes */}
            <Card>
              <CardHeader>
                <CardTitle>Mes groupes d'achat</CardTitle>
                <CardDescription>
                  Gérez vos groupes actifs et terminés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mesGroupes.map((group) => (
                  <div
                    key={group.id}
                    className="mb-4 p-4 border rounded-lg"
                  >
                    <h3 className="text-lg font-semibold">
                      {group.title}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <Badge
                        className={`${getStatusColor(
                          group.status
                        )} text-white`}
                      >
                        {getStatusText(group.status)}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {group.participants}/
                        {group.maxParticipants} participants
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Revenu: {group.revenue}€
                    </p>
                    <Link to={`/groups/${group.id}`}>
                      <Button size="sm">Voir détails</Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Commandes en attente */}
            <Card>
              <CardHeader>
                <CardTitle>Commandes en attente</CardTitle>
                <CardDescription>
                  Commandes en attente de validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="mb-4 p-4 border rounded-lg"
                  >
                    <p className="font-medium">{order.product}</p>
                    <p className="text-sm text-gray-600">
                      Client: {order.customer}
                    </p>
                    <p className="text-sm text-gray-600">
                      Montant: {order.total}€
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Valider
                      </Button>
                      <Button size="sm" variant="outline">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Refuser
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar : Besoins récents */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Besoins récents</CardTitle>
                <CardDescription>
                  Créez des groupes basés sur ces demandes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentNeeds.map((need) => (
                  <div
                    key={need.id}
                    className="mb-4 p-4 border rounded-lg"
                  >
                    <h4 className="text-sm font-semibold">
                      {need.product}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {need.description}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                      <span>Budget: {need.budget}€</span>
                      <span>{need.interested} intéressés</span>
                    </div>
                    <Button size="sm" className="w-full">
                      Créer un groupe
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
