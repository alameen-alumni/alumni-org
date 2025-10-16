import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import Layout from "./components/Layout";
import LoadingScreen from "./components/LoadingScreen";
import { ProtectedRoute } from './components/ProtectedRoute';
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import { ModalProvider } from './contexts/ModalContext';
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
const PublicIdCard = lazyWithRetry(() => import('./pages/IdCard'));

const queryClient = new QueryClient();

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Preload critical components after initial load
    setTimeout(() => {
      preloadCriticalComponents();
    }, 2000);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" />
          <ModalProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<LoadingScreen onLoadingComplete={handleLoadingComplete} />}>
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
                  <Route path="/id-card" element={<PublicIdCard />} />
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
