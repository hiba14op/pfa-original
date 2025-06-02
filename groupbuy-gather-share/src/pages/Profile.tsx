import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, Bell, CreditCard, Users } from 'lucide-react';
import { useEffect } from 'react';

const Profile = () => {
  const { user, switchRole } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      }
    };
  
    fetchProfile();
  }, []);

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès."
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur s'est produite",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/password', {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès."
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur s'est produite",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  const handleRoleSwitch = async () => {
    const newRole = user?.role === 'buyer' ? 'seller' : 'buyer';

    
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/users/${user?.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        toast({
          title: "Compte supprimé",
          description: "Votre compte a été supprimé avec succès.",
        });
    
        // Optionnel : redirige ou déconnecte
        window.location.href = "/";
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.response?.data?.message || "Impossible de supprimer le compte.",
          variant: "destructive",
        });
      }
    };

    const handleDeleteAccount = async () => {
      const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
      if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/role', { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Rôle modifié",
        description: `Vous êtes maintenant ${newRole === 'seller' ? 'vendeur' : 'acheteur'}.`
      });

      switchRole(newRole);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de changer le rôle.",
        variant: "destructive"
      });
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
  <Navigation />

  <div className="max-w-4xl mx-auto py-10 px-4">
    <Card>
      <CardHeader>
        <CardTitle>Mon Profil</CardTitle>
        <CardDescription>Modifier vos informations personnelles ou votre mot de passe</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Informations personnelles</TabsTrigger>
            <TabsTrigger value="password">Changer le mot de passe</TabsTrigger>
          </TabsList>

          {/* Onglet Informations personnelles */}
          <TabsContent value="profile" className="mt-4 space-y-4">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <Label>Nom</Label>
                <Input value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} />
              </div>
              <div>
                <Label>Adresse</Label>
                <Input value={profileData.address} onChange={e => setProfileData({ ...profileData, address: e.target.value })} />
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
                <Badge className={getRoleColor(user?.role || '')}>
                  {getRoleName(user?.role || '')}
                </Badge>
              </div>
            </form>
            <Button
                 variant="destructive"
                 className="w-full"
                 onClick={handleDeleteAccount}
            >
                 Supprimer mon compte
            </Button>


          </TabsContent>

          {/* Onglet Mot de passe */}
          <TabsContent value="password" className="mt-4 space-y-4">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label>Mot de passe actuel</Label>
                <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              </div>
              <div>
                <Label>Nouveau mot de passe</Label>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div>
                <Label>Confirmer le nouveau mot de passe</Label>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Modification..." : "Changer le mot de passe"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</div>

  );
};

export default Profile;
