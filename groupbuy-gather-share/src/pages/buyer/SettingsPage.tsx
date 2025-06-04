import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SellerProfile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: ''

  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    axios.get('http://localhost:5000/api/seller/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setProfile(res.data))
    .catch(err => {
      console.error("Erreur chargement profil", err);
      toast({ title: "Erreur", description: "Impossible de charger le profil", variant: "destructive" });
    });
  };

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    axios.put('http://localhost:5000/api/seller/profile', profile, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      toast({ title: "Succès", description: "Profil mis à jour avec succès ✅" });
    })
    .catch(err => {
      console.error("Erreur mise à jour profil", err);
      toast({ title: "Erreur", description: "Échec de mise à jour", variant: "destructive" });
    })
    .finally(() => setLoading(false));
  };
  {!profile.username && <p className="text-gray-500">Chargement du profil...</p>}

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Mon Profil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Nom d'utilisateur</Label>
          <Input value={profile.username} onChange={e => handleChange('username', e.target.value)} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={profile.email} onChange={e => handleChange('email', e.target.value)} required />
        </div>
        <div>
          <Label>Téléphone</Label>
          <Input value={profile.phoneNumber} onChange={e => handleChange('phoneNumber', e.target.value)} />
        </div>
        <div>
          <Label>Adresse</Label>
          <Input value={profile.address} onChange={e => handleChange('address', e.target.value)} />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Mettre à jour'}
        </Button>
      </form>
    </div>
  );
  
};

export default SellerProfile;
