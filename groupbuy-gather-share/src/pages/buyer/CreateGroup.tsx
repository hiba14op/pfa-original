import { useState, useEffect } from 'react';
import axios from 'axios';

const CreateGroup = () => {
  const [form, setForm] = useState({
    productName: '',
    status: 'ouvert',
    totalAmount: '',
    supplierId: '',
    maxGroupSize: '',
    minGroupSize: '',
    deliveryAddress: '',
    image: ''
  });
  const [needs, setNeeds] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/grouporder', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('✅ Groupe créé avec succès !');
    } catch (err: any) {
      alert('❌ Erreur : ' + (err.response?.data?.message || 'Inconnue'));
    }
  };

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const token = localStorage.getItem('token')
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const response = await axios.get(
          'http://localhost:5000/api/buyer/needs', // API pour les acheteurs
          config
        )
        setNeeds(response.data.needs || [])
      } catch (error) {
        // Replace this with your preferred notification/toast implementation
        alert("Erreur : Impossible de charger les besoins des acheteurs");
      }
    }

    fetchNeeds()
  }, [])

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Créer un Groupe d’Achat</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl">
        <input name="productName" placeholder="Nom du produit" onChange={handleChange} required />
        <input name="totalAmount" placeholder="Montant total (€)" onChange={handleChange} required />
        <input name="supplierId" placeholder="ID Fournisseur" onChange={handleChange} required />
        <input name="maxGroupSize" placeholder="Taille max" onChange={handleChange} required />
        <input name="minGroupSize" placeholder="Taille min" onChange={handleChange} required />
        <input name="deliveryAddress" placeholder="Adresse de livraison" onChange={handleChange} required />
        <input name="image" placeholder="Image (URL ou nom)" onChange={handleChange} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Créer le groupe
        </button>
      </form>
    </div>
  );
};
export default CreateGroup;

