import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft as ChevronLeft, CreditCard, User, MapPin, Shield } from "lucide-react";

/* ---------- Validation Schema ---------- */
const formSchema = z.object({
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(6, "Numéro de téléphone invalide"),
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  country: z.string().min(1, "Pays requis"),
  paymentMethod: z.enum(["COMPTANT", "CREDIT"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function CommandePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [cartItem, setCartItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const cartItemId = query.get("cartItemId");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { country: "Cameroun", paymentMethod: "COMPTANT" },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");

    if (!userId && token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.id;
      } catch (e) {
        console.error("Erreur de décodage du token", e);
      }
    }

    if (!cartItemId || !userId || !token) {
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`http://localhost:8084/api/panier/${userId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Erreur lors de la récupération du panier");

        const data = await res.json();
        
        // On cherche l'article spécifique dans le panier
        const item = data.articles?.find(
          (a: any) => String(a.articleId) === String(cartItemId)
        );

        if (item) {
          setCartItem(item);
        } else {
          toast({ title: "Erreur", description: "Article introuvable dans votre panier.", variant: "destructive" });
        }
      } catch (err: any) {
        toast({ title: "Erreur", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [cartItemId, toast]);

  const onSubmit = async (data: FormValues) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) { navigate("/connexion"); return; }

    setIsSubmitting(true);
    try {
      const params = new URLSearchParams({
        typeCommande: data.paymentMethod,
        clientId: userId,
        vendeurId: "1", 
        cartItemId: String(cartItemId),
        paysLivraison: data.country
      });

      const res = await fetch(`http://localhost:8084/api/commandes/from-panier?${params.toString()}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(await res.text());

      toast({ title: "Succès", description: "Votre commande a été enregistrée !" });
      navigate("/catalogue"); 
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally { setIsSubmitting(false); }
  };

  if (loading) return <Layout><div className="py-20 text-center">Chargement...</div></Layout>;

  if (!cartItem) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h2 className="text-xl font-bold text-red-500">Session ou article invalide</h2>
          <Button onClick={() => navigate("/panier")} className="mt-4">Retour au panier</Button>
        </div>
      </Layout>
    );
  }

  // --- LOGIQUE EXACTEMENT COMME DANS INDEX.TSX ---
  // On regarde d'abord dans 'images' (tableau), puis 'image', puis 'imageUrl'
  const getCleanImageUrl = (item: any) => {
    let rawPath = "";
    
    if (item.images && item.images.length > 0) {
      rawPath = item.images[0];
    } else {
      rawPath = item.image || item.imageUrl || "";
    }

    if (!rawPath) return "https://placehold.co/400x250?text=Pas+d+image";

    // Si c'est déjà une URL complète
    if (rawPath.startsWith('http')) return rawPath;

    // Sinon construction identique à Index.tsx
    return `http://localhost:8084/api/uploads/${rawPath}`;
  };

  const finalImageUrl = getCleanImageUrl(cartItem);

  return (
    <Layout>
      <div className="bg-slate-50/50 min-h-screen pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/panier" className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-4">
              <ChevronLeft size={16} /> Retour au panier
            </Link>
            <h1 className="text-3xl font-extrabold lg:text-4xl">Finalisation</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Section Coordonnées */}
                <Card className="shadow-sm border-none ring-1 ring-slate-200">
                  <CardHeader><CardTitle className="flex gap-3 text-lg"><User className="text-primary"/> Vos Coordonnées</CardTitle></CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom complet</Label>
                      <Input {...form.register("lastName")} placeholder="Jean Dupont" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input {...form.register("email")} placeholder="jean@mail.com" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Téléphone</Label>
                      <Input {...form.register("phone")} placeholder="+237 ..." />
                    </div>
                  </CardContent>
                </Card>

                {/* Section Adresse */}
                <Card className="shadow-sm border-none ring-1 ring-slate-200 mt-6">
                  <CardHeader><CardTitle className="flex gap-3 text-lg"><MapPin className="text-primary"/> Adresse de livraison</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Input {...form.register("address")} placeholder="Quartier, Rue, N° de porte" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input {...form.register("city")} placeholder="Ville" />
                      <Input {...form.register("country")} placeholder="Pays" />
                    </div>
                  </CardContent>
                </Card>

                {/* Section Paiement */}
                <Card className="shadow-sm border-none ring-1 ring-slate-200 mt-6">
                  <CardHeader><CardTitle className="flex gap-3 text-lg"><CreditCard className="text-primary"/> Mode de paiement</CardTitle></CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-4">
                    <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${form.watch("paymentMethod") === "COMPTANT" ? "border-primary bg-primary/5" : "border-slate-100"}`}>
                      <input type="radio" value="COMPTANT" {...form.register("paymentMethod")} className="sr-only" />
                      <span className="font-bold block">Paiement Comptant</span>
                    </label>
                    <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${form.watch("paymentMethod") === "CREDIT" ? "border-primary bg-primary/5" : "border-slate-100"}`}>
                      <input type="radio" value="CREDIT" {...form.register("paymentMethod")} className="sr-only" />
                      <span className="font-bold block">Demande de Crédit</span>
                    </label>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Résumé de commande */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 shadow-xl border-none ring-1 ring-slate-200 overflow-hidden">
                <div className="bg-primary p-4 text-primary-foreground text-center font-bold uppercase">
                  Résumé de la commande
                </div>
                <CardContent className="pt-6 space-y-4">
                  <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border">
                    <img 
                      src={finalImageUrl} 
                      alt={cartItem.modele || "Véhicule"}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x250?text=Moto"; }}
                    />
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 uppercase">
                      {cartItem.marque} {cartItem.modele}
                    </h4>
                    <p className="text-sm text-slate-500">Réf: {cartItem.reference}</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Quantité</span>
                      <span className="font-medium">{cartItem.quantite}</span>
                    </div>

                    {cartItem.options?.map((opt: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-600 italic">
                        <span>+ {opt.nom}</span>
                        <span>{opt.prix?.toLocaleString()} FCFA</span>
                      </div>
                    ))}

                    <div className="bg-primary/5 p-4 rounded-xl flex justify-between items-center mt-4 border border-primary/10">
                      <span className="font-bold">TOTAL</span>
                      <span className="text-2xl font-black text-primary">
                        {(cartItem.montantTotal || 0).toLocaleString()} <small className="text-xs">FCFA</small>
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col p-6 bg-slate-50/80 border-t">
                  <Button 
                    form="checkout-form"
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg font-bold gradient-primary shadow-lg"
                  >
                    {isSubmitting ? "Traitement..." : "Confirmer l'achat"}
                  </Button>
                  <p className="mt-4 text-[10px] text-slate-400 flex items-center gap-2">
                    <Shield size={12} className="text-green-500"/> Transaction sécurisée
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}