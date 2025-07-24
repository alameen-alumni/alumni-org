import { RecoilRoot } from 'recoil';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Notice from "./pages/Notice";
import Alumni from "./pages/Alumni";
import Details from "./pages/Details";
import Gallery from "./pages/Gallery";
import PayUs from "./pages/PayUs";
import Login from "./pages/Login";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";
import Reunion2k25 from "./pages/reunion2k25";
import { ModalProvider } from './contexts/ModalContext';
import AlumniDbFiller from './pages/admin/AlumniDbFiller';

const queryClient = new QueryClient();

const App = () => (
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ModalProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/events" element={<Layout><Events /></Layout>} />
                <Route path="/notice" element={<Layout><Notice /></Layout>} />
                <Route path="/alumni" element={<Layout><Alumni /></Layout>} />
                <Route path="/details" element={<Layout><Details /></Layout>} />
                <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
                <Route path="/reunion2k25" element={<Layout><Reunion2k25 /></Layout>} />
                <Route path="/donate" element={<Layout><PayUs /></Layout>} />
                <Route path="/services" element={<Layout><Services /></Layout>} />
                <Route path="/services" element={<Layout><AlumniDbFiller /></Layout>} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ModalProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </RecoilRoot>
);

export default App;
