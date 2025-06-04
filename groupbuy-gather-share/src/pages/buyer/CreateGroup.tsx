import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const CreateGroup = () => {
  const navigate = useNavigate();
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
    console.log('Form data:', form); // Vérifiez si productName est bien présent
    try {
      await axios.post('http://localhost:5000/api/grouporder', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('✅ Groupe créé avec succès !');
      navigate('/group-list');
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
        alert("Erreur : Impossible de charger les besoins des acheteurs");
      }
    }

    fetchNeeds()
  }, [])

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Créer un Groupe d’Achat</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl">
       <input
  type="text"
  name="productName"
  value={form.productName}
  onChange={handleChange}
  placeholder="Nom du produit"
  required
/>

        <input name="totalAmount" placeholder="Montant total (€)" onChange={handleChange} required />
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

function fetchGroups() {
  throw new Error('Function not implemented.');
}

