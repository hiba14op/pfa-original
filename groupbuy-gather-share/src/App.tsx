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
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";

// Buyer
import BuyerLayout from './pages/buyer/BuyerLayout'; 
import BuyerDashboard from "./pages/buyer/Dashboard";
import CreateNeed from "./pages/buyer/CreateNeed";


<Routes>
  <Route path="/buyer/*" element={<BuyerLayout />} /> {/* ✅ le * est obligatoire */}
</Routes>


// Seller
import SellerLayout from "./pages/seller/SellerLayout";
import SellerDashboard from "./pages/seller/Dashboard";
import Needs from "./pages/seller/Needs";
import CreateGroup from "./pages/seller/CreateGroup";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminStats from "./pages/admin/Stats";
 

const queryClient = new QueryClient();

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
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

            {/* Public groups */}
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/:id" element={<GroupDetail />} />

            {/* Buyer */}
            <Route
              path="/buyer/dashboard"
              element={
                <ProtectedRoute allowedRoles={["buyer"]}>
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/needs/create"
              element={
                <ProtectedRoute allowedRoles={["buyer"]}>
                  <CreateNeed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/home"
              element={
                <ProtectedRoute allowedRoles={["buyer"]}>
                  <BuyerLayout />
                </ProtectedRoute>
              }
            />

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
              <Route path="groups/create" element={<CreateGroup />} />
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

          {/* ✅ Le chatbot est visible pour tout le monde, sur toutes les pages */}
          <ChatCopilot />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
