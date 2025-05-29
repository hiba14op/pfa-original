import React, { useState } from 'react';
import axios from 'axios';

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    console.log("✅ Données à envoyer :", formData);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      console.log("✅ Réponse reçue :", response.data);
      alert(response.data.message);
    } catch (error: any) {
      console.error("❌ Erreur axios :", error);
      alert(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Erreur inconnue lors de l'inscription"
      );
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Nom d'utilisateur"
        required
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Mot de passe"
        required
      />
      <input
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Téléphone"
        required
      />
      <input
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Adresse"
        required
      />
      <button onClick={handleSignup}>S'inscrire</button>
    </div>
  );
};

export default Signup;
