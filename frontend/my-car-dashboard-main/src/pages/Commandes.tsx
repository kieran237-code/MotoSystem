import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Package, Clock, CheckCircle2, Truck, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: any = {
  EN_ATTENTE: { label: "En attente", icon: Clock, color: "bg-amber-500", progress: "w-1/3", text: "Commande reçue" },
  VALIDEE: { label: "Validée", icon: CheckCircle2, color: "bg-blue-500", progress: "w-2/3", text: "Préparation en cours" },
  LIVREE: { label: "Livrée", icon: Truck, color: "bg-green-600", progress: "w-full", text: "Livraison effectuée" },
  ANNULEE: { label: "Annulée", icon: AlertCircle, color: "bg-red-500", progress: "w-0", text: "Commande annulée" },
};

export default function Commandes() {
  const [commandes, setCommandes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");

    if (!token || !email) {
      navigate("/connexion");
      return;
    }

    const loadData = async () => {
      try {
        // 1. Récupération de l'utilisateur pour avoir son ID
        const userRes = await fetch(`http://localhost:8084/api/email/${email}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await userRes.json();

        // 2. Récupération des commandes liées à cet ID
        const ordersRes = await fetch(`http://localhost:8084/api/commandes/client/${userData.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const ordersData = await ordersRes.json();
        
        setCommandes(ordersData);
      } catch (err) {
        console.error("Erreur lors du chargement des commandes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (commandes.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
            <h1 className="text-2xl font-bold mb-4">Aucune commande</h1>
            <p className="text-muted-foreground mb-8">Vous n'avez pas encore passé de commande.</p>
            <Button className="gradient-primary shadow-primary" asChild>
              <Link to="/vehicules">Parcourir les véhicules</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Mes Commandes</h1>
          <p className="text-muted-foreground">Suivez vos achats et accédez à vos documents officiels</p>
        </div>

        <div className="space-y-8">
          {commandes.map((order) => {
            const status = statusConfig[order.etatCommande] || statusConfig.EN_ATTENTE;
            const StatusIcon = status.icon;
            const vehicule = order.vehicule;

            return (
              <Card key={order.id} className="overflow-hidden border-none shadow-lg ring-1 ring-slate-200">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Package className="w-5 h-5 text-primary" />
                        N° {order.numCommande || `CMD-${order.id}`}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Commandé le {new Date(order.dateCommande).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <Badge className={cn("gap-2 px-4 py-1.5 text-white", status.color)}>
                      <StatusIcon className="w-4 h-4" />
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Barre de progression visuelle */}
                  <div className="mb-8">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600">{status.text}</span>
                      <span className="text-sm font-bold text-primary">Progression</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full transition-all duration-700", status.color, status.progress)} />
                    </div>
                  </div>

                  {/* Infos véhicule */}
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 space-y-1 text-center md:text-left">
                      <h3 className="text-xl font-black uppercase text-slate-800 tracking-tight">
                        {vehicule.marque} {vehicule.modele}
                      </h3>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <Badge variant="outline" className="bg-slate-50">{vehicule.type}</Badge>
                        <Badge variant="outline" className="bg-slate-50">{vehicule.energie}</Badge>
                        <Badge variant="outline" className="bg-slate-50 text-xs italic">Réf: {vehicule.reference}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground pt-2">
                        Destination : <span className="font-bold text-slate-700 uppercase">{order.paysLivraison}</span>
                      </p>
                    </div>

                    <div className="w-full md:w-auto text-center md:text-right bg-primary/5 p-4 rounded-2xl border border-primary/10">
                      <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Total TTC</p>
                      <p className="text-2xl font-black text-primary">
                        {order.montant.toLocaleString()} <small className="text-[10px]">FCFA</small>
                      </p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Actions avec redirection dynamique vers /documents/:orderId */}
                  <div className="flex flex-wrap justify-center md:justify-end gap-3">
                    <Button variant="outline" size="sm" className="gap-2 border-slate-200" asChild>
                      <Link to={`/documents/${order.id}`}>
                        <FileText className="w-4 h-4" /> Voir document
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}