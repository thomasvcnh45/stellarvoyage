
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ApodPage from "./pages/ApodPage";
import GalleryPage from "./pages/GalleryPage"; 
import MarsRoversPage from "./pages/MarsRoversPage";
import ISSTrackerPage from "./pages/ISSTrackerPage";
import AsteroidsPage from "./pages/AsteroidsPage";
import StarField from "./components/StarField";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

// Composant wrapper pour gérer la Navbar et le Footer sur toutes les pages sauf la page d'accueil
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <>
      {!isHomePage && <Navbar />}
      {children}
      {!isHomePage && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <StarField starCount={200} />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/apod" element={
            <AppLayout>
              <ApodPage />
            </AppLayout>
          } />
          <Route path="/gallery" element={
            <AppLayout>
              <GalleryPage />
            </AppLayout>
          } />
          <Route path="/mars-rovers" element={
            <AppLayout>
              <MarsRoversPage />
            </AppLayout>
          } />
          <Route path="/iss-tracker" element={
            <AppLayout>
              <ISSTrackerPage />
            </AppLayout>
          } />
          <Route path="/asteroids" element={
            <AppLayout>
              <AsteroidsPage />
            </AppLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
