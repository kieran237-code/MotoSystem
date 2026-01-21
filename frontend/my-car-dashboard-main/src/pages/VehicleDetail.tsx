import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ShoppingCart, Heart } from "lucide-react"; // Retrait de Check
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// 🔹 Import du hook Decorator (assure-toi du bon chemin)
import { useDecoratedVehicle } from "@/decorator/useDecoratedVehicle";

export default function VehicleDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`http://localhost:8084/api/vehicules/${id}`);
        if (!response.ok) throw new Error("Erreur lors du chargement du véhicule");
        const data = await response.json();
        setVehicle(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  // 🔹 Hook Decorator
  const { options, addOption, removeOption, getDescription, getPrice } = useDecoratedVehicle(
    vehicle?.modele || "",
    vehicle?.prixBase || 0
  );

const addToCart = async () => {
  const token = localStorage.getItem("token");
  const utilisateurId = localStorage.getItem("userId");

  if (!token) {
    toast({
      title: "Accès refusé",
      description: "Veuillez vous connecter pour ajouter un véhicule au panier.",
      variant: "destructive",
    });
    setTimeout(() => navigate("/connexion"), 1500);
    return;
  }

  try {
    // 🔹 Étape 1 : Ajouter le véhicule avec image et infos
    const response = await fetch(
      `http://localhost:8084/api/panier/${utilisateurId}/articles/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: vehicle.images?.[0] || null,   // <-- image principale
          modele: vehicle.modele,
          marque: vehicle.marque,
          prixBase: vehicle.prixBase,
        }),
      }
    );

    if (!response.ok) throw new Error("Erreur lors de l'ajout du véhicule");

    // 🔹 Étape 2 : Récupérer le panier mis à jour
    const panier = await response.json();

    // Trouver l'article correspondant au véhicule ajouté
    const article = panier.articles.find((a: any) => a.vehiculeId === Number(id));
    if (!article) throw new Error("Article non trouvé dans le panier");

    const articleId = article.articleId;

    // 🔹 Étape 3 : Ajouter les options choisies avec l'articleId
    for (const opt of options) {
      const optResponse = await fetch(
        `http://localhost:8084/api/panier/${utilisateurId}/articles/${articleId}/options/${opt.code}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!optResponse.ok) {
        throw new Error(`Erreur lors de l'ajout de l'option ${opt.nom}`);
      }
    }

    // 🔹 Étape 4 : Notification
    toast({
      title: "Ajouté au panier !",
      description: getDescription(),
    });
  } catch (err: any) {
    toast({
      title: "Erreur",
      description: err.message,
      variant: "destructive",
    });
  }
};


  if (loading) return <p className="p-10 text-center">Chargement du véhicule...</p>;
  if (error) return <p className="p-10 text-center text-red-500 font-bold">Erreur: {error}</p>;
  if (!vehicle) return <p className="p-10 text-center">Véhicule introuvable</p>;

  const IMAGE_BASE_URL = "http://localhost:8084/api/uploads/";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/catalogue" className="text-muted-foreground hover:text-primary flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Retour au catalogue
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">{vehicle.modele}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Colonne gauche : grande image + miniatures */}
          <div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-lg border">
              <img
                src={
                  vehicle.images && vehicle.images.length > 0
                    ? `${IMAGE_BASE_URL}${vehicle.images[currentImageIndex]}`
                    : "/placeholder.jpg"
                }
                alt={vehicle.modele}
                className="w-full h-full object-cover transition-all duration-300"
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {vehicle.estSolde && (
                  <Badge className="gradient-secondary text-secondary-foreground font-bold text-lg px-4 py-1">
                    SOLDES
                  </Badge>
                )}
              </div>
            </div>

            {/* Miniatures */}
            {vehicle.images && vehicle.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Toutes les images :</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {vehicle.images.map((imgName: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "flex-shrink-0 rounded-lg overflow-hidden border-2 transition-transform",
                        currentImageIndex === index ? "border-primary shadow-md scale-105" : "border-transparent hover:opacity-90"
                      )}
                      aria-label={`Voir image ${index + 1}`}
                    >
                      <img
                        src={`${IMAGE_BASE_URL}${imgName}`}
                        alt={`Miniature ${index + 1}`}
                        className="w-28 h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite : détails + options + actions */}
          <div className="space-y-6">
            <div>
              <p className="text-primary font-medium mb-1 tracking-widest uppercase text-xs">
                {vehicle.marque}
              </p>
              <h1 className="text-4xl font-bold mb-2">{vehicle.modele}</h1>
              <div className="flex items-center gap-4">
                <p className="text-2xl font-extrabold text-primary">
                  {vehicle.prixBase.toLocaleString("fr-FR")} XAF
                </p>
                {vehicle.qteStock <= 0 ? (
                  <Badge variant="destructive">Rupture de stock</Badge>
                ) : (
                  <Badge className="bg-green-500">En Stock ({vehicle.qteStock})</Badge>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="font-semibold">Options disponibles :</p>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => addOption({ code: "SIEGES_CUIR", nom: "Sièges cuir", prix: 200000 })}>
                  + Sièges cuir
                </Button>
                <Button onClick={() => addOption({ code: "SIEGES_SPORT", nom: "Sièges sport", prix: 250000 })}>
                  + Sièges sport
                </Button>
                <Button onClick={() => addOption({ code: "GPS", nom: "GPS intégré", prix: 150000 })}>
                  + GPS
                </Button>
                <Button onClick={() => addOption({ code: "TOIT_OUVRANT", nom: "Toit ouvrant", prix: 300000 })}>
                  + Toit ouvrant
                </Button>
                <Button onClick={() => addOption({ code: "CAMERA_RECUL", nom: "Caméra de recul", prix: 100000 })}>
                  + Caméra de recul
                </Button>
              </div>
            </div>

            {options.length > 0 && (
              <div>
                <p className="font-semibold">Options choisies :</p>
                <ul className="list-disc pl-5 mt-2">
                  {options.map((o) => (
                    <li key={o.code} className="flex items-center justify-between">
                      <span>
                        {o.nom} (+{o.prix.toLocaleString("fr-FR")} XAF)
                      </span>
                      <button
                        className="ml-4 text-red-500"
                        onClick={() => removeOption(o.code)}
                        aria-label={`Retirer ${o.nom}`}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-lg font-medium mt-2">Prix total avec options :</p>
              <p className="text-2xl font-bold text-primary">{getPrice().toLocaleString("fr-FR")} XAF</p>
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 gradient-primary shadow-primary h-14 text-lg font-bold"
                disabled={vehicle.qteStock <= 0}
                onClick={addToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Ajouter au panier
              </Button>

              <Button size="lg" variant="outline" className="h-14 w-14 rounded-xl">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}