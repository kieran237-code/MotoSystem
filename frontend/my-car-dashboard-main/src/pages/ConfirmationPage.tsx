import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, Calendar, MapPin, User, ArrowRight, Printer } from "lucide-react";

export default function ConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    // Si on n'a pas les données dans le state (ex: refresh), on les cherche via l'API
    if (!order && id) {
      fetch(`http://localhost:8084/api/commandes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then((res) => res.json())
        .then((data) => setOrder(data))
        .catch((err) => console.error("Erreur chargement commande", err))
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  if (loading) return <div className="p-20 text-center">Chargement de votre reçu...</div>;
  if (!order) return <div className="p-20 text-center">Commande introuvable.</div>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-4">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-bold mb-2">Merci pour votre commande !</h1>
          <p className="text-muted-foreground text-lg">
            Votre commande <span className="font-mono font-bold text-primary">#{order.numCommande.slice(0, 8)}</span> a été validée.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Détails Commande */}
          <Card className="border-t-4 border-t-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" /> Récapitulatif de la commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={16} /> {new Date(order.dateCommande).toLocaleDateString()}
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {order.etatCommande}
                </Badge>
              </div>
              
              <Separator />

              <div className="flex gap-4 items-center">
                <div className="bg-muted w-24 h-16 rounded flex items-center justify-center font-bold text-xs">
                  {order.vehicule.marque}
                </div>
                <div>
                  <h3 className="font-bold">{order.vehicule.marque} - {order.vehicule.modele}</h3>
                  <p className="text-sm text-muted-foreground">Réf: {order.vehicule.reference} | {order.vehicule.couleur}</p>
                </div>
                <div className="ml-auto font-bold">
                  {order.vehicule.prixBase.toLocaleString()} FCFA
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{order.vehicule.prixBase.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-primary pt-2">
                  <span>Total payé</span>
                  <span>{order.montant.toLocaleString()} FCFA</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client & Livraison */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 font-bold mb-3"><User size={18}/> Client</div>
                <p className="text-sm capitalize">{order.clientNom}</p>
                <p className="text-sm text-muted-foreground">{order.clientEmail}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 font-bold mb-3"><MapPin size={18}/> Livraison</div>
                <p className="text-sm capitalize">{order.paysLivraison}</p>
                <p className="text-sm text-muted-foreground italic">En attente d'expédition</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/vehicules">Continuer mes achats</Link>
            </Button>
            <Button className="flex-1 gap-2 gradient-primary" onClick={() => window.print()}>
              <Printer size={18} /> Imprimer la facture
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}