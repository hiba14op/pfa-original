import { useEffect, useState } from "react";
import axios from "axios";

const SellerSettings = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/seller/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => setForm(res.data))
    .catch(err => console.error("Erreur chargement profil vendeur", err));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.put("http://localhost:5000/api/seller/profile", form, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(() => alert("Profil mis à jour"))
    .catch(err => console.error("Erreur mise à jour profil", err));
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Paramètres du compte</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["username", "email", "phoneNumber", "address"].map(field => (
          <div key={field}>
            <label className="block text-sm font-medium">{field}</label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
      </form>
    </div>
  );
};

export default SellerSettings;
