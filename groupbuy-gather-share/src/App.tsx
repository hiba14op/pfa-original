import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import ChatCopilot from "./components/chatCopilot"; // ✅ Import du chatbot Copilot

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TestConnection from "./pages/TestConnection";

import GroupDetail from "./pages/GroupDetail";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";

// Buyer
import BuyerLayout from './pages/buyer/BuyerLayout'; 
import BuyerDashboard from "./pages/buyer/Dashboard";
import CreateNeed from "./pages/buyer/CreateNeed";
import MesGroupes from "./pages/buyer/MesGroupes";
import OrderList from "./pages/buyer/OrderList";
import MesAvis from "./pages/buyer/mesAvis";
import SettingsPage from "./pages/buyer/SettingsPage";
import ProductList from "./pages/buyer/ProductList"; // ✅ Import ProductList component
import ProtectedTest from "./pages/buyer/ProtectedTest"; // ✅ Import ProtectedTest component
import CreateGroup from "./pages/buyer/CreateGroup";
// <Routes>
//   <Route path="/buyer/*" element={<BuyerLayout />} /> {/* ✅ le * est obligatoire */}
// </Routes>


// Seller
import SellerLayout from "./pages/seller/SellerLayout";
import SellerDashboard from "./pages/seller/Dashboard";
import Needs from "./pages/seller/Needs";
import SellerCreateGroup from "./pages/seller/CreateGroup";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminStats from "./pages/admin/Stats";

import GroupList from "./pages/buyer/GroupList";



 

const queryClient = new QueryClient();

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/protected" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role || ""))
    return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
<QueryClientProvider client={queryClient}>
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/test" element={<TestConnection />} />
 <Route
   path="/protected"
   element={<ProtectedTest />}
 /> 
        {/* Public groups */}
        <Route
  path="/group-list/:id"
  element={
    <ProtectedRoute allowedRoles={[]}>
      <GroupDetail />
    </ProtectedRoute>
  }
/>
<Route
  path="/group-list"
  element={
    <ProtectedRoute allowedRoles={[]}>
      <GroupList fetchData={() => {}} /> {/* Composant pour afficher la liste des groupes */}
    </ProtectedRoute>
  }
/>

        {/* Buyer Layout avec sous-routes */}
       <Route
  path="/buyer/*"
  element={
    <ProtectedRoute allowedRoles={["buyer"]}>
      <BuyerLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<BuyerDashboard />} /> {/* Accueil */}
  <Route path="needs" element={<CreateNeed />} /> {/* Mes Besoins */}
  <Route path="MesGroupes" element={<MesGroupes />} /> {/* Mes Groupes */}
  <Route path="orders" element={<OrderList />} /> {/* Commandes */}
  <Route path="reviews" element={<MesAvis />} /> {/* Mes Avis */}
  <Route path="products" element={<SettingsPage />} /> {/* Liste des produits */}
  <Route path="settings" element={<SettingsPage />} /> {/* Paramètres */}
  <Route path="create-group" element={<CreateGroup />} /> {/* Créer un Groupe */}

  {/* Page de test protégée */}

</Route>

        {/* Seller */}
        <Route
          path="/seller/*"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SellerDashboard />} />
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="needs" element={<Needs />} />
          <Route path="groups/create" element={<SellerCreateGroup />} />
          <Route path="group/:id" element={<GroupDetail />} />


        </Route>

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminStats />
            </ProtectedRoute>
          }
        />

        {/* Profile & Payment */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={[]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:orderId"
          element={
            <ProtectedRoute allowedRoles={[]}>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </TooltipProvider>
</QueryClientProvider>
  );
}
