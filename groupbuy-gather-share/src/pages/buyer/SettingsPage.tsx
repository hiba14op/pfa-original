import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Assure-toi que ce chemin est correct

const SettingsPage = () => {
  const { user } = useAuth(); // 👈 récupère l'utilisateur connecté
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState({
    email: true,
    groups: true,
    promos: false,
  });

  useEffect(() => {
    if (user) {
      setUsername(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Paramètres du compte</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Préférences de notification</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications({ ...notifications, email: e.target.checked })
                }
                className="mr-3 w-4 h-4 text-blue-600"
              />
              Notifications par email
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.groups}
                onChange={(e) =>
                  setNotifications({ ...notifications, groups: e.target.checked })
                }
                className="mr-3 w-4 h-4 text-blue-600"
              />
              Alertes de nouveaux groupes
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.promos}
                onChange={(e) =>
                  setNotifications({ ...notifications, promos: e.target.checked })
                }
                className="mr-3 w-4 h-4 text-blue-600"
              />
              Promotions et offres spéciales
            </label>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Sauvegarder
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
