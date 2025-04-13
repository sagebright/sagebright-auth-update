
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider";
import { LanguageProvider } from "./contexts/language/LanguageContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import NotFound from '@/pages/NotFound';
import AskSage from '@/pages/AskSage';
import AuthRoutes from './pages/AuthRoutes';
import VoiceTestPage from '@/pages/VoiceTest';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/auth/*" element={<AuthRoutes />} />
                  
                  {/* App Routes */}
                  <Route path="/" element={<AskSage />} />
                  <Route path="/ask-sage" element={<AskSage />} />
                  
                  {/* Add our test route - only visible in development */}
                  {process.env.NODE_ENV === 'development' && (
                    <Route path="/voice-test" element={<VoiceTestPage />} />
                  )}
                  
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </AuthProvider>
          </QueryClientProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
