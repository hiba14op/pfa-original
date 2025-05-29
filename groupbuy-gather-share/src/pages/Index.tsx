// src/pages/Index.tsx
import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'            // <-- on passe sur Navbar
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Users, TrendingDown, Shield, Star, ArrowRight } from 'lucide-react'

export default function Index() {
  const features = [
    { icon: <TrendingDown className="h-8 w-8 text-green-600" />, title: "Prix réduits",   description: "Obtenez des tarifs préférentiels grâce aux achats en volume" },
    { icon: <Users className="h-8 w-8 text-blue-600" />,     title: "Communauté",     description: "Rejoignez d'autres acheteurs pour maximiser les économies" },
    { icon: <Shield className="h-8 w-8 text-purple-600" />,   title: "Sécurisé",       description: "Paiements protégés et vendeurs vérifiés" },
    { icon: <Star className="h-8 w-8 text-yellow-600" />,     title: "Qualité",        description: "Produits sélectionnés et évalués par la communauté" },
  ]

  const testimonials = [
    { name: "Marie L.", role: "Acheteuse", content: "J'ai économisé plus de 40% sur mes achats électroniques grâce à GroupBuy !", rating: 5 },
    { name: "Pierre M.", role: "Vendeur",   content: "Excellente plateforme pour écouler mes stocks et fidéliser ma clientèle.",   rating: 5 },
    { name: "Sophie D.", role: "Acheteuse", content: "Interface simple et paiements sécurisés. Je recommande vivement !",            rating: 5 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* <Navbar /> */}

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Économisez avec les&nbsp;
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            achats groupés
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Rejoignez une communauté d’acheteurs intelligents et obtenez les meilleurs prix grâce à notre plateforme.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3">
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/groups">
            <Button size="lg" variant="outline" className="px-8 py-3">
              Parcourir les groupes
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Pourquoi choisir GroupBuy ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">{f.icon}</div>
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{f.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* … reste de la page … */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <ShoppingCart className="h-8 w-8 text-indigo-400" />
            <span className="ml-2 text-xl font-bold">GroupBuy</span>
          </div>
          <p className="text-gray-400">© 2024 GroupBuy. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
