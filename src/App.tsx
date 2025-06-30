
import { RecoilRoot } from 'recoil';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Content from "./pages/Content";
import Notice from "./pages/Notice";
import Alumni from "./pages/Alumni";
import Details from "./pages/Details";
import Gallery from "./pages/Gallery";
import PayUs from "./pages/PayUs";
import Login from "./pages/Login";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/content" element={<Layout><Content /></Layout>} />
            <Route path="/notice" element={<Layout><Notice /></Layout>} />
            <Route path="/alumni" element={<Layout><Alumni /></Layout>} />
            <Route path="/details" element={<Layout><Details /></Layout>} />
            <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
            <Route path="/pay-us" element={<Layout><PayUs /></Layout>} />
            <Route path="/services" element={<Layout><Services /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </RecoilRoot>
);

export default App;
