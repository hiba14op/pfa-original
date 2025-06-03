import { useEffect, useState } from 'react';
import axios from 'axios';

function TestConnection() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/test')
      .then(res => setMessage(res.data.message))
      .catch(() => setMessage("❌ Erreur de connexion au backend"));
  }, []);

  return (
    <div>
      <h2>Test de connexion Backend</h2>
      <p>{message}</p>
    </div>
  );
}

export default TestConnection;
