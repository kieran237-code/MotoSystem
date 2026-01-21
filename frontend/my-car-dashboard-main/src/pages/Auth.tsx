import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {jwtDecode} from "jwt-decode";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Mail, Lock, User, Shield, Eye, EyeOff, AlertCircle, MapPin, Phone, Globe } from "lucide-react";

const BASE_URL = "http://localhost:8084/api"; 

export default function Auth() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  
  // registerData mis à jour pour correspondre à l'entité Adresse.java
  const [registerData, setRegisterData] = useState({
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "UTILISATEUR",
    pays: "Cameroun",
    ville: "",
    telephone: "",
    boitePostale: ""
  });

  const handleResponseError = async (response: Response) => {
    try {
      const errorData = await response.json();
      return errorData.message || `Erreur ${response.status}: Action impossible.`;
    } catch {
      if (response.status === 500) return "Le serveur a rencontré un problème interne (Erreur 500).";
      if (response.status === 404) return "Le service d'inscription est introuvable.";
      return "Une erreur inconnue est survenue.";
    }
  };

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setErrorMessage(null);

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", loginData.email);

      try {
        const decoded: any = jwtDecode(token);
        console.log("Payload reçu du backend :", decoded);

        // ⚠️ Stocker l'id et le rôle
        localStorage.setItem("userId", decoded.id.toString());
        localStorage.setItem("userRole", decoded.role);

        navigate("/index");
      } catch (error) {
        console.error("Erreur de décodage:", error);
        navigate("/index");
      }
    } else {
      const msg = await handleResponseError(response);
      setErrorMessage(msg);
    }
  } catch (error) {
    setErrorMessage("Serveur injoignable.");
  } finally {
    setLoading(false);
  }
};

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/inscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // On structure le JSON pour correspondre à l'objet complexe Adresse en Java
        body: JSON.stringify({
          nom: registerData.nom,
          email: registerData.email,
          password: registerData.password,
          role: registerData.role,
          adresse: {
            pays: registerData.pays,
            ville: registerData.ville,
            telephone: registerData.telephone,
            boitePostale: registerData.boitePostale
          }
        }),
      });

      if (response.ok) {
        navigate("/verification", { state: { email: registerData.email } });
      } else {
        const msg = await handleResponseError(response);
        setErrorMessage(msg);
      }
    } catch (error) {
      setErrorMessage("Erreur réseau : le serveur est peut-être hors ligne.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
                <span className="text-2xl">🚗</span>
              </div>
              <span className="font-display text-3xl text-gradient">My_Car</span>
            </Link>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}

          <Card className="shadow-xl border-muted/40">
            <Tabs defaultValue="connexion" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="connexion">Connexion</TabsTrigger>
                  <TabsTrigger value="inscription">Inscription</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
                {/* --- TAB CONNEXION --- */}
                <TabsContent value="connexion" className="space-y-4 mt-0">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-login">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email-login"
                          type="email"
                          className="pl-10"
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password-login">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password-login"
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button disabled={loading} type="submit" className="w-full gradient-primary h-11">
                      {loading ? "Chargement..." : "Se connecter"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                {/* --- TAB INSCRIPTION --- */}
                <TabsContent value="inscription" className="space-y-4 mt-0">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom complet</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="nom"
                          placeholder="Jean Daniel"
                          className="pl-10"
                          value={registerData.nom}
                          onChange={(e) => setRegisterData({...registerData, nom: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-reg">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email-reg"
                          type="email"
                          placeholder="nom@exemple.com"
                          className="pl-10"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    {/* --- CHAMPS ADRESSE (Ville & Téléphone) --- */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ville">Ville</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="ville"
                            placeholder="Yaoundé"
                            className="pl-10"
                            value={registerData.ville}
                            onChange={(e) => setRegisterData({...registerData, ville: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telephone">Téléphone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="telephone"
                            placeholder="677xxxxxx"
                            className="pl-10"
                            value={registerData.telephone}
                            onChange={(e) => setRegisterData({...registerData, telephone: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* --- CHAMPS ADRESSE (Pays) --- */}
                    <div className="space-y-2">
                      <Label htmlFor="pays">Pays</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="pays"
                          className="pl-10"
                          value={registerData.pays}
                          onChange={(e) => setRegisterData({...registerData, pays: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Type de compte</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                          id="role"
                          className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none appearance-none"
                          value={registerData.role}
                          onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                        >
                          <option value="ADMINISTRATEUR">ADMINISTRATEUR</option>
                          <option value="UTILISATEUR">UTILISATEUR</option>
                          <option value="CLIENT">CLIENT</option>
                          <option value="SOCIETE">SOCIETE</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pass-reg">Mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="pass-reg"
                            type={showPassword ? "text" : "password"}
                            value={registerData.password}
                            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-reg">Confirmation</Label>
                        <Input
                          id="confirm-reg"
                          type="password" 
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <Button disabled={loading} type="submit" className="w-full gradient-primary h-11 mt-2">
                      {loading ? "Création en cours..." : "Créer mon compte"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </Layout>
  );
}