import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Undo, Redo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [panier, setPanier] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const utilisateurId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const IMAGE_BASE_URL = "http://localhost:8084/api/uploads/";

  // 🔹 Charger le panier
  useEffect(() => {
    const fetchPanier = async () => {
      try {
        const response = await fetch(`http://localhost:8084/api/panier/${utilisateurId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Erreur lors du chargement du panier");
        const data = await response.json();
        setPanier(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPanier();
  }, [utilisateurId, token]);
  useEffect(() => { console.log("Panier reçu :", panier); }, [panier]);

  // 🔹 Retirer un article
  const retirerArticle = async (articleId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8084/api/panier/${utilisateurId}/articles/${articleId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Erreur lors du retrait de l'article");
      const data = await response.json();
      setPanier(data);
      toast({ title: "Article retiré du panier" });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
  };

  // 🔹 Retirer une option
  const retirerOption = async (optionChoisieId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8084/api/panier/${utilisateurId}/options/${optionChoisieId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Erreur lors du retrait de l'option");
      const data = await response.json();
      setPanier(data);
      toast({ title: "Option retirée" });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
  };

  // 🔹 Undo / Redo
  const undo = async () => {
    const response = await fetch(`http://localhost:8084/api/panier/${utilisateurId}/undo`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setPanier(data);
    toast({ title: "Action annulée (Undo)" });
  };

  const redo = async () => {
    const response = await fetch(`http://localhost:8084/api/panier/${utilisateurId}/redo`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setPanier(data);
    toast({ title: "Action rétablie (Redo)" });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-lg">Chargement du panier...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center text-red-500 font-bold">
          <p>Erreur : {error}</p>
        </div>
      </Layout>
    );
  }

  if (!panier || !panier.articles || panier.articles.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" /> Mon Panier
          </h1>

          <div className="text-center py-20">
            <ShoppingCart className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold mb-4">Votre panier est vide</p>
            <Button onClick={() => navigate("/catalogue")} size="lg" className="text-lg font-bold">
              Voir le catalogue
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="flex justify-end gap-2">
            <Button onClick={undo}><Undo className="w-4 h-4 mr-1" /> Undo</Button>
            <Button onClick={redo}><Redo className="w-4 h-4 mr-1" /> Redo</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" /> Mon Panier
        </h1>

        {panier.articles.map((article: any) => (
          <div key={article.articleId} className="border rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex gap-4 items-start">
              {/* Image miniature corrigée */}
              <img
                src={
                  article.image
                    ? `${IMAGE_BASE_URL}${article.image}`
                    : article.images?.length > 0
                      ? `${IMAGE_BASE_URL}${article.images[0]}`
                      : article.vehicule?.images?.length > 0
                        ? `${IMAGE_BASE_URL}${article.vehicule.images[0]}`
                        : "/placeholder.jpg"
                }
                alt={article.modele || article.vehicule?.modele}
                className="w-32 h-24 object-cover rounded-md border"
              />


              <div className="flex-1">
                <h2 className="text-xl font-semibold">{article.marque} {article.modele}</h2>
                <p className="text-muted-foreground">Réf: {article.reference}</p>
                <p className="font-bold text-primary mt-2">
                  {article.montantTotal.toLocaleString("fr-FR")} XAF
                </p>

                {/* Options */}
                {article.options.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Options :</p>
                    <ul className="list-disc pl-5">
                      {article.options.map((opt: any) => (
                        <li key={opt.optionId} className="flex justify-between items-center">
                          <span>{opt.nom} (+{opt.prix.toLocaleString("fr-FR")} XAF)</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => retirerOption(opt.optionId)}
                          >
                            Retirer
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Button variant="destructive" onClick={() => retirerArticle(article.articleId)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Retirer l'article
                  </Button>

                  <Button
                    variant="default"
                    className="gradient-primary" // Optionnel : pour le style
                    onClick={() => navigate(`/commande?cartItemId=${article.articleId}`)}
                  >
                    Passer commande
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Separator className="my-6" />

        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold">Total : {panier.montantTotal.toLocaleString("fr-FR")} XAF</p>
          <div className="flex gap-2">
            <Button onClick={undo}><Undo className="w-4 h-4 mr-1" /> Undo</Button>
            <Button onClick={redo}><Redo className="w-4 h-4 mr-1" /> Redo</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
