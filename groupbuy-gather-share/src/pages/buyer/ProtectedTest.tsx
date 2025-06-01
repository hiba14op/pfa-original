import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedTest: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Rediriger vers /login si l'utilisateur n'est pas connecté
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Afficher un message d'accès restreint si l'utilisateur n'a pas le rôle "buyer"
  if (user?.role !== "buyer") {
    return (
      <div>
        <h1>Accès restreint</h1>
        <p>Seuls les acheteurs peuvent accéder à cette page.</p>
      </div>
    );
  }

  // Afficher le contenu pour les utilisateurs autorisés
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