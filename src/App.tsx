
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { handleApiError } from "./lib/handleApiError";
import { AuthProvider } from "./contexts/auth/AuthContext";
import { LanguageProvider } from "./contexts/language/LanguageContext";
import { getOrgFromUrl } from "./lib/subdomainUtils";
import "@/i18n"; // Import i18n configuration

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
const DesignSystem = lazy(() => import("@/pages/DesignSystem"));
const FormComponentsExample = lazy(() => import("@/pages/FormComponentsExample"));
const ErrorHandlingExample = lazy(() => import("@/pages/ErrorHandlingExample"));
const SkeletonPreview = lazy(() => import("@/pages/SkeletonPreview"));
const ImageComponentPreview = lazy(() => import("./pages/ImageComponentPreview"));

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    <span className="ml-2 text-primary">Loading page...</span>
  </div>
);

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
  const orgContext = getOrgFromUrl();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
              <PageErrorBoundary>
                <Suspense fallback={<PageLoadingFallback />}>
                  <Routes>
                    {/* Root path behavior depends on subdomain */}
                    <Route 
                      path="/" 
                      element={
                        orgContext ? (
                          <ProtectedRoute>
                            {/* Will be redirected based on role in ProtectedRoute */}
                            <div className="flex h-screen items-center justify-center">
                              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                              <span className="ml-2 text-primary">Loading your dashboard...</span>
                            </div>
                          </ProtectedRoute>
                        ) : (
                          <Index />
                        )
                      } 
                    />
                    
                    <Route path="/contact-us" element={<ContactUs />} />
                    
                    {/* Auth routes */}
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/signup" element={<Signup />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                    <Route path="/auth/callback" element={<Navigate to="/user-dashboard" replace />} />
                    <Route path="/auth/recovery" element={<RecoveryPage />} />
                    
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
                        <ProtectedRoute requiredRole="admin">
                          <HRDashboard />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* New Admin Dashboard Route */}
                    <Route
                      path="/admin-dashboard"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboard />
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
                    
                    <Route path="/design-system" element={<DesignSystem />} />
                    <Route path="/dev-debug" element={<DevDebugPage />} />
                    <Route path="/form-components-example" element={<FormComponentsExample />} />
                    <Route path="/error-handling-example" element={<ErrorHandlingExample />} />
                    <Route path="/skeleton-preview" element={<SkeletonPreview />} />
                    <Route path="/image-preview" element={<ImageComponentPreview />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </PageErrorBoundary>
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
