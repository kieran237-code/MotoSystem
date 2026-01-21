import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { mockVehicles } from "@/data/mockData";
import {
  ArrowRight,
  Search,
  Car,
  Bike,
  Zap,
  Fuel,
  Shield,
  Truck,
  CreditCard,
  Star,
  User,
} from "lucide-react";

const categories = [
  { icon: Car, label: "Automobiles", href: "/catalogue?type=automobile", color: "from-primary to-blue-600" },
  { icon: Bike, label: "Scooters", href: "/catalogue?type=scooter", color: "from-secondary to-orange-600" },
  { icon: Zap, label: "Électriques", href: "/catalogue?fuel=electrique", color: "from-accent to-emerald-600" },
  { icon: Fuel, label: "Essence", href: "/catalogue?fuel=essence", color: "from-purple-500 to-violet-600" },
];

const features = [
  { icon: Shield, title: "Garantie 2 ans", description: "Tous nos véhicules sont garantis" },
  { icon: Truck, title: "Livraison gratuite", description: "Partout en Europe" },
  { icon: CreditCard, title: "Paiement flexible", description: "Comptant ou crédit" },
  { icon: Star, title: "Service premium", description: "Accompagnement personnalisé" },
];

const BASE_API = "http://localhost:8084/api/vehicules";

const Index = () => {
  const [userName, setUserName] = useState<string | null>(null);

  // Data from backend
  const [featuredVehicles, setFeaturedVehicles] = useState<any[]>([]);
  const [saleVehicles, setSaleVehicles] = useState<any[]>([]);

  // Loading / error states
  const [loadingFeatured, setLoadingFeatured] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        const decoded = JSON.parse(jsonPayload);
        setUserName(decoded.sub || "Utilisateur");
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Fetch featured (first 5 vehicles in DB)
    const fetchFeatured = async () => {
      setLoadingFeatured(true);
      try {
        const res = await fetch(`${BASE_API}`);
        if (!res.ok) throw new Error("Erreur récupération véhicules");
        const data = await res.json();
        // take first 5 (preserve order returned by backend)
        const firstFive = Array.isArray(data) ? data.slice(0, 5) : [];
        setFeaturedVehicles(firstFive);
      } catch (err) {
        console.error("Erreur fetch featured:", err);
        // fallback to mock data
        setFeaturedVehicles(mockVehicles.slice(0, 5));
      } finally {
        setLoadingFeatured(false);
      }
    };

    // Fetch sale vehicles (soldés) and take first 3
    const fetchSales = async () => {
      setLoadingSales(true);
      try {
        const res = await fetch(`${BASE_API}/search/soldees`);
        if (!res.ok) throw new Error("Erreur récupération soldes");
        const data = await res.json();
        const firstThree = Array.isArray(data) ? data.slice(0, 3) : [];
        setSaleVehicles(firstThree);
      } catch (err) {
        console.error("Erreur fetch sales:", err);
        // fallback to mock sold vehicles
        const fallback = mockVehicles.filter((v) => v.isOnSale).slice(0, 3);
        setSaleVehicles(fallback);
      } finally {
        setLoadingSales(false);
      }
    };

    fetchFeatured();
    fetchSales();
  }, []);

  // Helper to map backend entity to VehicleCard props (keeps previous behavior)
// dans Index.tsx (ou fichier où tu fais le mapping)
const mapToVehicleCard = (v: any) => {
  const vehicleType = v?.nombrePortes !== undefined ? "automobile" : "scooter";
  const fuelType = v?.batterieKwh !== undefined ? "electrique" : "essence";

  return {
    id: String(v?.id ?? ""),
    name: v?.modele ?? "Modèle inconnu",
    brand: v?.marque ?? "Marque inconnue",
    // Défaut 0 si absent
    price: typeof v?.prixBase === "number" ? v.prixBase : Number(v?.prixBase ?? 0),
    color: v?.couleur ?? "",
    image: v?.images && v.images.length > 0 ? `http://localhost:8084/api/uploads/${v.images[0]}` : "/placeholder.jpg",
    isOnSale: !!v?.estSolde,
    inStock: (v?.qteStock ?? 0) > 0,
    type: vehicleType as "automobile" | "scooter",
    fuelType: fuelType as "electrique" | "essence",
  };
};


  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              {userName && (
                <div className="flex items-center gap-2 mb-4 text-primary animate-fade-in">
                  <User className="w-5 h-5" />
                  <span className="text-xl font-medium font-display">
                    Ravi de vous revoir, <span className="font-bold">{userName}</span> !
                  </span>
                </div>
              )}

              <Badge className="mb-6 gradient-secondary text-secondary-foreground px-4 py-2 text-sm">🎉 Nouvelles offres disponibles</Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Trouvez votre
                <span className="block text-gradient font-display">véhicule idéal</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
                Découvrez notre sélection exclusive d'automobiles et scooters. Essence ou électrique, trouvez le véhicule qui vous correspond.
              </p>

              <div className="flex gap-2 mb-8 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="Rechercher un véhicule..." className="pl-10 h-12 bg-card border-0 shadow-md" />
                </div>
                <Button size="lg" className="gradient-primary shadow-primary h-12 px-6">Rechercher</Button>
              </div>

              <div className="flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Véhicules</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-secondary">50+</p>
                  <p className="text-sm text-muted-foreground">Marques</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">10k+</p>
                  <p className="text-sm text-muted-foreground">Clients satisfaits</p>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in hidden lg:block">
              <div className="relative z-10">
                <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop" alt="Véhicule de luxe" className="w-full rounded-3xl shadow-2xl" />
              </div>

              <Card className="absolute -bottom-8 -left-8 z-20 animate-float shadow-lg">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                    <Zap className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Économisez 30%</p>
                    <p className="text-sm text-muted-foreground">sur les électriques</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explorez par catégorie</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Filtrez rapidement selon vos préférences pour trouver le véhicule parfait</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, index) => (
              <Link key={cat.label} to={cat.href} className="group" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="h-full card-hover border-0 shadow-md overflow-hidden">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <cat.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">{cat.label}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Véhicules en vedette</h2>
              <p className="text-muted-foreground">Notre sélection des meilleures offres du moment</p>
            </div>
            <Button variant="outline" className="gap-2" asChild>
              <Link to="/catalogue">
                Voir tout <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingFeatured
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-56 bg-card animate-pulse rounded" />)
              : (featuredVehicles.length > 0 ? featuredVehicles : mockVehicles.slice(0, 4)).map((vehicle: any, index: number) => (
                  <div key={vehicle.id ?? index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <VehicleCard vehicle={mapToVehicleCard(vehicle)} />
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      {(!loadingSales && saleVehicles.length > 0) && (
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 gradient-secondary opacity-10" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <Badge className="mb-4 gradient-secondary text-secondary-foreground px-4 py-2 text-lg animate-pulse-slow">🔥 SOLDES</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Offres exceptionnelles</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Profitez de réductions sur les véhicules en stock depuis longtemps</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {saleVehicles.map((vehicle: any) => (
                <VehicleCard key={vehicle.id} vehicle={mapToVehicleCard(vehicle)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-4 shadow-primary">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
