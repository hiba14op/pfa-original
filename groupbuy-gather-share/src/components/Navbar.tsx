// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="p-4 border-b bg-white shadow-sm flex items-center">
      <Link to="/" className="text-gray-800">Accueil</Link>
{user?.role !== "seller" && (
  <Link to="/group-list" className="ml-4 text-gray-600">Groupes</Link>
)}

      {/* si pas connecté → login/signup */}
      {!isAuthenticated ? (
        <>
          <Link to="/login" className="ml-4">Login</Link>
          <Link to="/signup" className="ml-4">Signup</Link>
        </>
      ) : (
        <>
          {/* si seller → lien vers son espace */}
          {user?.role === "seller" && (
            <Link to="/seller" className="ml-4">
              Espace Vendeur
            </Link>
          )}
          {/* lien profil (tous utilisateurs connectés) */}
          <Link to="/profile" className="ml-4">Profil</Link>
        </>
      )}
    </nav>
  );
}
