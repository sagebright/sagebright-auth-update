
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PageErrorBoundary from "@/components/PageErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";

// Change to normal imports for the login path to avoid lazy loading issues
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";

const Index = React.lazy(() => import("@/pages/Index"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const HRDashboard = React.lazy(() => import("@/pages/HRDashboard"));
const AdminDashboard = React.lazy(() => import("@/pages/AdminDashboard"));
const AskSage = React.lazy(() => import("@/pages/AskSage"));
const ContactUs = React.lazy(() => import("@/pages/ContactUs"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
// Login and ForgotPassword imported directly above
const Signup = React.lazy(() => import("@/pages/auth/Signup"));
const RecoveryPage = React.lazy(() => import("@/pages/auth/RecoveryPage"));
const DevDebugPage = React.lazy(() => import("@/pages/dev-debug"));
const ApiDebug = React.lazy(() => import("@/pages/ApiDebug"));
const DesignSystem = React.lazy(() => import("@/pages/DesignSystem"));
const FormComponentsExample = React.lazy(() => import("@/pages/FormComponentsExample"));
const ErrorHandlingExample = React.lazy(() => import("@/pages/ErrorHandlingExample"));
const SkeletonPreview = React.lazy(() => import("@/pages/SkeletonPreview"));
const ImageComponentPreview = React.lazy(() => import("@/pages/ImageComponentPreview"));
const AuthDebug = React.lazy(() => import("@/pages/AuthDebug"));

const PageLoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    <span className="ml-2 text-primary">Loading page...</span>
  </div>
);

// RootRedirect is kept in App.tsx (import from there)
import RootRedirect from "@/App"; // This is only for types' sake, actual usage will be explained in App

const AppRoutes = ({ RootRedirectComponent }: { RootRedirectComponent: React.FC }) => (
  <Suspense fallback={<PageLoadingFallback />}>
    <Routes>
      <Route path="/" element={<RootRedirectComponent />} />
      <Route path="/contact-us" element={<ContactUs />} />

      {/* Auth routes - login and forgotPassword not lazily loaded */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/signup" element={<Signup />} />
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

      {/* Development and debugging routes */}
      <Route path="/design-system" element={<DesignSystem />} />
      <Route path="/dev-debug" element={<DevDebugPage />} />
      <Route path="/auth-debug" element={<AuthDebug />} />
      <Route path="/api-debug" element={<ApiDebug />} />
      <Route path="/form-components-example" element={<FormComponentsExample />} />
      <Route path="/error-handling-example" element={<ErrorHandlingExample />} />
      <Route path="/skeleton-preview" element={<SkeletonPreview />} />
      <Route path="/image-preview" element={<ImageComponentPreview />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
