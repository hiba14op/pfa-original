import React, { useState } from 'react';
import axios from 'axios';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      alert(response.data.message); // "Connexion réussie"
      localStorage.setItem('token', response.data.token); // Stocker le token
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la connexion');
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Mot de passe" />
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
};

export default Login;