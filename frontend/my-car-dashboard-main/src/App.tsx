import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Catalogue from "./pages/Catalogue";
import VehicleDetail from "./pages/VehicleDetail";
import Panier from "./pages/Panier";
import Commande from "./pages/Commande";
import Commandes from "./pages/Commandes";
import Documents from "./pages/Documents";
import Profil from "./pages/Profil";
import Auth from "./pages/Auth";
import Recherche from "./pages/Recherche";
import NotFound from "./pages/NotFound";
import Verification from "./pages/verification";
import Index2 from "./pages2/index2";
import PublierVehicule from "./pages/Publier";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/index" element={<Index2/>}/>
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/vehicule/:id" element={<VehicleDetail />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/commande" element={<Commande />} />
          <Route path="/commandes" element={<Commandes />} />
          <Route path="/documents/:orderId" element={<Documents />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/connexion" element={<Auth />} />
          <Route path="/inscription" element={<Auth />} />
          <Route path="/recherche" element={<Recherche />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/verification" element ={<Verification/>} />
          <Route path="/publier" element={<PublierVehicule/>}/>

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
