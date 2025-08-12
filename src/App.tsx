import { RecoilRoot } from 'recoil';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState, Suspense, lazy } from 'react';
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import LoadingScreen from "./components/LoadingScreen";
import { ModalProvider } from './contexts/ModalContext';
import ScrollToTop from "./components/ScrollToTop";
import { ProtectedRoute } from './components/ProtectedRoute';
import { lazyWithRetry, preloadCriticalComponents } from './utils/lazy-loading';

// Lazy load all pages with retry mechanism
const Index = lazyWithRetry(() => import("./pages/Index"));
const Events = lazyWithRetry(() => import("./pages/Events"));
const Notice = lazyWithRetry(() => import("./pages/Notice"));
const Alumni = lazyWithRetry(() => import("./pages/Alumni"));
const Details = lazyWithRetry(() => import("./pages/Details"));
const Gallery = lazyWithRetry(() => import("./pages/Gallery"));
const PayUs = lazyWithRetry(() => import("./pages/PayUs"));
const Login = lazyWithRetry(() => import("./pages/Login"));
const Services = lazyWithRetry(() => import("./pages/Services"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const AdminPanel = lazyWithRetry(() => import("./pages/AdminPanel"));
const Reunion2k25 = lazyWithRetry(() => import("./pages/reunion2k25"));
const AlumniDbFiller = lazyWithRetry(() => import('./pages/admin/AlumniDbFiller'));
const UserDashboard = lazyWithRetry(() => import('./pages/UserDashboard'));
const CoreTeam = lazyWithRetry(() => import('./pages/CoreTeam'));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#186F65]"></div>
      <p className="text-gray-600">Loading page...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Preload critical components after initial load
    setTimeout(() => {
      preloadCriticalComponents();
    }, 1000);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ModalProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Layout><Index /></Layout>} />
                  <Route path="/events" element={<Layout><Events /></Layout>} />
                  <Route path="/notice" element={<Layout><Notice /></Layout>} />
                  <Route path="/alumni" element={<Layout><Alumni /></Layout>} />
                  <Route path="/core-team" element={<Layout><CoreTeam /></Layout>} />
                  <Route path="/details" element={<Layout><Details /></Layout>} />
                  <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
                  <Route path="/reunion2k25" element={<Reunion2k25 />} />
                  <Route path="/donate" element={<Layout><PayUs /></Layout>} />
                  <Route path="/services" element={<Layout><Services /></Layout>} />
                  <Route path="/services" element={<Layout><AlumniDbFiller /></Layout>} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ModalProvider>
        </TooltipProvider>
      </AuthProvider>
    </>
  );
};

const App = () => (
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  </RecoilRoot>
);

export default App;
