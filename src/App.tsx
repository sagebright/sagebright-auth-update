import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import ContactUs from "@/pages/ContactUs";
import DesignSystem from "@/pages/DesignSystem";
import ErrorHandlingExample from "@/pages/ErrorHandlingExample";
import FormComponentsExample from "@/pages/FormComponentsExample";
import LoadingStatesExample from "@/pages/LoadingStatesExample";
import ImageOptimizationDemo from "@/pages/ImageOptimizationDemo";
import HRDashboard from "@/pages/HRDashboard";
import AskSage from "@/pages/AskSage";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { handleApiError } from "@/lib/handleApiError";
import { initializeClient } from "@/lib/lovable";

function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      mutations: {
        onError: handleApiError,
      },
      queries: {
        onError: handleApiError,
        retry: false,
      },
    },
  }));

  initializeClient({
    apiKey: import.meta.env.VITE_LOVABLE_API_KEY,
    apiUrl: import.meta.env.VITE_LOVABLE_API_URL,
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
      
      </QueryClientProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/error-handling-example" element={<ErrorHandlingExample />} />
        <Route path="/form-components-example" element={<FormComponentsExample />} />
        <Route path="/loading-states-example" element={<LoadingStatesExample />} />
        <Route path="/image-optimization" element={<ImageOptimizationDemo />} />
        <Route path="/hr-dashboard" element={<ProtectedRoute><HRDashboard /></ProtectedRoute>} />
        <Route path="/ask-sage" element={<ProtectedRoute><AskSage /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
