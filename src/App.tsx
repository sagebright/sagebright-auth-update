import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { handleApiError } from "./lib/handleApiError";
import { AuthProvider } from "./contexts/auth/AuthContext";
import { LanguageProvider } from "./contexts/language/LanguageContext";
import { getOrgFromUrl } from "./lib/subdomainUtils";
import "@/i18n"; // Import i18n configuration
import { checkAuth } from "./lib/backendAuth";
import SessionTimeoutDetector from "@/components/auth/SessionTimeoutDetector";
import AppRoutes from "@/routes/AppRoutes";

// Eagerly loaded components
import PageErrorBoundary from "./components/PageErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazily loaded page components
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const HRDashboard = lazy(() => import("./pages/HRDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AskSage = lazy(() => import("./pages/AskSage"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const RecoveryPage = lazy(() => import("./pages/auth/RecoveryPage"));
const DevDebugPage = lazy(() => import("@/pages/dev-debug"));
const ApiDebug = lazy(() => import("@/pages/ApiDebug"));
const DesignSystem = lazy(() => import("@/pages/DesignSystem"));
const FormComponentsExample = lazy(() => import("@/pages/FormComponentsExample"));
const ErrorHandlingExample = lazy(() => import("@/pages/ErrorHandlingExample"));
const SkeletonPreview = lazy(() => import("@/pages/SkeletonPreview"));
const ImageComponentPreview = lazy(() => import("./pages/ImageComponentPreview"));
const AuthDebug = lazy(() => import("@/pages/AuthDebug"));

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    <span className="ml-2 text-primary">Loading page...</span>
  </div>
);

// Root component to handle subdomain detection
const RootRedirect = () => {
  const orgContext = getOrgFromUrl();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        // Force a session check on initial load
        const isAuthValid = await checkAuth();
        console.log("🔍 Root auth check:", { isAuthenticated: isAuthValid, orgContext });
        setIsAuthenticated(isAuthValid);
      } catch (error) {
        console.error("❌ Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [orgContext]);

  if (isLoading) {
    return <PageLoadingFallback />;
  }

  // If on a subdomain and authenticated, go to user dashboard
  if (orgContext && isAuthenticated) {
    return <Navigate to="/user-dashboard" replace />;
  }
  
  // If on a subdomain but not authenticated, go to login
  if (orgContext && !isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Otherwise, show the landing page (for non-subdomain)
  return <Index />;
};

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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SessionTimeoutDetector />
            <LanguageProvider>
              <PageErrorBoundary>
                <AppRoutes RootRedirectComponent={RootRedirect} />
              </PageErrorBoundary>
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
