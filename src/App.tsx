
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PageErrorBoundary from "./components/PageErrorBoundary";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import HRDashboard from "./pages/HRDashboard";
import AskSage from "./pages/AskSage";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { AuthProvider } from "./contexts/auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DevDebugPage from "@/pages/dev-debug";
import DesignSystem from "@/pages/DesignSystem";
import FormComponentsExample from "@/pages/FormComponentsExample";
import ErrorHandlingExample from "@/pages/ErrorHandlingExample";
import SkeletonPreview from "@/pages/SkeletonPreview";
import { getOrgFromUrl } from "./lib/subdomainUtils";
import { handleApiError } from "./lib/handleApiError";
import ImageComponentPreview from "./pages/ImageComponentPreview";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      onError: (error) => {
        console.error('React Query mutation error:', error);
        handleApiError(error, { context: 'global mutation', showToast: true });
      },
    },
  },
});

// Component to wrap public pages that use Navbar and need useAuth
const PublicAuthRoute = ({ element }) => {
  return (
    <AuthProvider>
      {element}
    </AuthProvider>
  );
};

const App = () => {
  const orgContext = getOrgFromUrl();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageErrorBoundary>
            <Routes>
              {/* Root path behavior depends on subdomain */}
              <Route 
                path="/" 
                element={
                  orgContext ? (
                    <AuthProvider>
                      <ProtectedRoute>
                        {/* Will be redirected based on role in ProtectedRoute */}
                        <div className="flex h-screen items-center justify-center">
                          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                          <span className="ml-2 text-primary">Loading your dashboard...</span>
                        </div>
                      </ProtectedRoute>
                    </AuthProvider>
                  ) : (
                    <PublicAuthRoute element={<Index />} />
                  )
                } 
              />
              
              <Route 
                path="/contact-us" 
                element={<PublicAuthRoute element={<ContactUs />} />} 
              />
              
              {/* Wrap all auth routes with AuthProvider */}
              <Route 
                path="/auth/login" 
                element={
                  <AuthProvider>
                    <Login />
                  </AuthProvider>
                } 
              />
              <Route 
                path="/auth/signup" 
                element={
                  <AuthProvider>
                    <Signup />
                  </AuthProvider>
                } 
              />
              <Route 
                path="/auth/forgot-password" 
                element={
                  <AuthProvider>
                    <ForgotPassword />
                  </AuthProvider>
                } 
              />
              <Route path="/auth/callback" element={<Navigate to="/user-dashboard" replace />} />
              
              <Route
                path="/user-dashboard"
                element={
                  <AuthProvider>
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </AuthProvider>
                }
              />
              
              <Route
                path="/dashboard"
                element={
                  <AuthProvider>
                    <ProtectedRoute>
                      <Navigate to="/user-dashboard" replace />
                    </ProtectedRoute>
                  </AuthProvider>
                }
              />
              
              <Route
                path="/hr-dashboard"
                element={
                  <AuthProvider>
                    <ProtectedRoute requiredRole="admin">
                      <HRDashboard />
                    </ProtectedRoute>
                  </AuthProvider>
                }
              />
              
              <Route
                path="/ask-sage"
                element={
                  <AuthProvider>
                    <ProtectedRoute>
                      <AskSage />
                    </ProtectedRoute>
                  </AuthProvider>
                }
              />
              
              <Route path="/design-system" element={<PublicAuthRoute element={<DesignSystem />} />} />
              <Route path="/dev-debug" element={<PublicAuthRoute element={<DevDebugPage />} />} />
              <Route path="/form-components-example" element={<PublicAuthRoute element={<FormComponentsExample />} />} />
              <Route path="/error-handling-example" element={<PublicAuthRoute element={<ErrorHandlingExample />} />} />
              <Route path="/skeleton-preview" element={<PublicAuthRoute element={<SkeletonPreview />} />} />
              <Route path="/image-preview" element={<PublicAuthRoute element={<ImageComponentPreview />} />} />
              
              <Route path="*" element={<PublicAuthRoute element={<NotFound />} />} />
            </Routes>
          </PageErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
