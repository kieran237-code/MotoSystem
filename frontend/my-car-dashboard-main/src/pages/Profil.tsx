import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package,
  Heart,
  Settings,
  LogOut,
  CreditCard,
  ShieldCheck,
  Calendar,
  Loader2
} from "lucide-react";

// Interface Backend
interface BackendUser {
  id: number;
  nom: string;
  email: string;
  role: string;
  actif: boolean;
  dateInscription: string;
  adresse: {
    pays: string;
    ville: string;
    boitePostale: string;
    telephone: string;
  };
}

export default function Profil() {
  const [userData, setUserData] = useState<BackendUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem("userEmail");
      const token = localStorage.getItem("token");

      if (!email || !token) {
        navigate("/connexion");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8084/api/email/${email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Erreur profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const isAdmin = userData?.role === "ADMINISTRATEUR";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Mon Profil</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Interface de gestion administrative" : "Gérez vos informations personnelles et vos préférences"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary/20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl font-bold gradient-primary text-white">
                    {userData?.nom.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold uppercase">{userData?.nom}</h2>
                <p className="text-muted-foreground text-sm">{userData?.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {userData?.role}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-4 space-y-2">
                {!isAdmin && (
                  <>
                    <Button variant="ghost" className="w-full justify-start gap-3" asChild>
                      <Link to="/commandes">
                        <Package className="w-5 h-5" />
                        Mes commandes
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <Heart className="w-5 h-5" />
                      Mes favoris
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <CreditCard className="w-5 h-5" />
                      Moyens de paiement
                    </Button>
                  </>
                )}
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <Settings className="w-5 h-5" />
                  Paramètres
                </Button>
                <Separator className="my-2" />
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Informations personnelles */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Nom complet</label>
                  <p className="font-medium text-lg">{userData?.nom}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Statut du compte</label>
                  <div className="flex items-center gap-2">
                    <Badge variant={userData?.actif ? "default" : "destructive"}>
                      {userData?.actif ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Email</label>
                    <p className="font-medium">{userData?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Téléphone</label>
                    <p className="font-medium">{userData?.adresse.telephone || "Non renseigné"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Adresse */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {isAdmin ? "Adresse" : "Adresse de livraison"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-muted/50 rounded-xl border border-dashed border-primary/20">
                  <p className="font-bold text-primary mb-1">{userData?.nom}</p>
                  <p className="text-muted-foreground">
                    {userData?.adresse.ville}, {userData?.adresse.pays}
                  </p>
                  {userData?.adresse.boitePostale && (
                    <p className="text-sm text-muted-foreground italic">
                      BP: {userData.adresse.boitePostale}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    Inscrit depuis le {userData ? new Date(userData.dateInscription).toLocaleDateString() : ""}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bouton de déconnexion administrative visible uniquement pour l'admin */}
            {isAdmin && (
              <Button 
                variant="destructive" 
                className="w-full py-6 text-lg font-bold shadow-lg mt-4"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Déconnexion administrative
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}