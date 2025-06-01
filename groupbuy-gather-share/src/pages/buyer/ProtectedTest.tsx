import React from "react";
// Make sure the path is correct and the file exists
import { useAuth } from "../../contexts/AuthContext";

const ProtectedTest: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Accès refusé : Vous devez être connecté pour accéder à cette page.</div>;
  }

  return (
    <div>
      <h1>Bienvenue sur la page protégée</h1>
      <p>Vous êtes connecté en tant que : {user?.name || "Utilisateur inconnu"}</p>
      <p>Votre rôle : {user?.role || "Aucun rôle attribué"}</p>
      <p>Ceci est une page de test pour les routes protégées.</p>
    </div>
  );
};

export default ProtectedTest;