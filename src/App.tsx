
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import IndexV1 from "./pages/IndexV1";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import HRDashboard from "./pages/HRDashboard";
import AskSage from "./pages/AskSage";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/contact-us" element={<ContactUs />} />
            
            {/* Auth Routes */}
            <Route path="/auth">
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="callback" element={<Navigate to="/user-dashboard" replace />} />
            </Route>
            
            {/* Protected Routes - All other routes require authentication */}
            <Route 
              path="/index-v1" 
              element={
                <ProtectedRoute>
                  <IndexV1 />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect old dashboard route to new user-dashboard route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navigate to="/user-dashboard" replace />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/hr-dashboard"
              element={
                <ProtectedRoute>
                  <HRDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/ask-sage"
              element={
                <ProtectedRoute>
                  <AskSage />
                </ProtectedRoute>
              }
            />
            
            {/* Redirects */}
            <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
