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
    },
    mutations: {
      onError: (error) => {
        console.error('React Query mutation error:', error);
        handleApiError(error, { context: 'global mutation', showToast: true });
      },
    },
  },
});

const App = () => {
  const orgContext = getOrgFromUrl();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <PageErrorBoundary>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/design-system" element={<DesignSystem />} />
                <Route path="/dev-debug" element={<DevDebugPage />} />
                <Route path="/form-components-example" element={<FormComponentsExample />} />
                <Route path="/error-handling-example" element={<ErrorHandlingExample />} />
                <Route path="/skeleton-preview" element={<SkeletonPreview />} />
                
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/callback" element={<Navigate to="/user-dashboard" replace />} />
                
                <Route 
                  path="/user-dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
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
                
                <Route path="/image-preview" element={<ImageComponentPreview />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageErrorBoundary>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
