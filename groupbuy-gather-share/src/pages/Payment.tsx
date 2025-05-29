import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Lock, Shield, CheckCircle } from 'lucide-react';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const order = {
    id: orderId,
    product: 'iPhone 15 Pro 128GB',
    quantity: 1,
    price: 999,
    shipping: 0,
    tax: 199.8,
    total: 1198.8,
    group: {
      participants: 45,
      maxParticipants: 50,
      discount: 17
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/payments',
        {
          groupOrderId: order.id,
          montant: order.total
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast({
        title: 'Paiement réussi !',
        description: 'Votre commande a été confirmée. Vous recevrez un email de confirmation.'
      });

      navigate('/buyer/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || "Une erreur s'est produite",
        variant: 'destructive'
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finaliser la commande</h1>
          <p className="text-gray-600">
            Sécurisez votre achat dans le groupe d'achat
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Informations de paiement
                </CardTitle>
                <CardDescription>
                  Choisissez votre méthode de paiement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  <div>
                    <Label>Méthode de paiement</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="mt-3"
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center cursor-pointer">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Carte bancaire
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="cursor-pointer">
                          PayPal
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Date d'expiration</Label>
                          <Input id="expiry" placeholder="MM/AA" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Nom sur la carte</Label>
                        <Input id="cardName" placeholder="Jean Dupont" className="mt-1" />
                      </div>
                    </div>
                  )}

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">Paiement sécurisé</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Vos informations de paiement sont protégées par un cryptage SSL 256 bits
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-12"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Traitement du paiement...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Payer {order.total}€
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif de commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{order.product}</h3>
                    <p className="text-sm text-gray-600">Quantité: {order.quantity}</p>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    -{order.group.discount}%
                  </Badge>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Prix unitaire</span>
                    <span>{order.price}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="text-green-600">Gratuite</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA</span>
                    <span>{order.tax}€</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{order.total}€</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center text-blue-800 text-sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="font-medium">Groupe confirmé</span>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">
                    {order.group.participants}/{order.group.maxParticipants} participants
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Prochaines étapes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                    <p className="text-gray-600">Confirmation de paiement immédiate</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                    <p className="text-gray-600">Préparation de la commande par le vendeur</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                    <p className="text-gray-600">Expédition sous 2-3 jours ouvrés</p>
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

export default Payment;
