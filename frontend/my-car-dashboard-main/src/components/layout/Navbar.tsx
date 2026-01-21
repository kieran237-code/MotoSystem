import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X, Search, LogOut, PlusCircle } from "lucide-react"; // Ajout de PlusCircle
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { jwtDecode } from "jwt-decode"; // Importation pour lire le rôle

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // État pour le rôle Admin

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Vérification du rôle si le token existe
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setIsAdmin(decoded.role === "ADMINISTRATEUR");
      } catch (error) {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [location]);

  // Définition dynamique des liens en fonction de l'authentification et du rôle
  const navLinks = [
    { 
      href: isAuthenticated ? "/index" : "/", 
      label: "Accueil" 
    },
    { href: "/catalogue", label: "Catalogue" },
    { href: "/recherche", label: "Recherche" },
  ];

  // AJOUT : On ajoute le lien Publication si l'utilisateur est ADMINISTRATEUR
  if (isAdmin) {
    navLinks.push({ href: "/publier", label: "Publication" });
  }

  const cartItemsCount = 3;

  const handleProtectedNavigation = (target: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(target);
    } else {
      navigate("/connexion");
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo dynamique */}
          <Link to={isAuthenticated ? "/index" : "/"} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
              <span className="text-xl">🚗</span>
            </div>
            <span className="font-display text-2xl text-gradient">My_Car</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-2 flex items-center gap-1",
                  location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {/* Petit indicateur visuel pour l'onglet Publication */}
                {link.href === "/publier" && <PlusCircle className="h-4 w-4" />}
                {link.label}
                {location.pathname === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
              <Link to="/recherche"><Search className="h-5 w-5" /></Link>
            </Button>

            {/* Panier */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => handleProtectedNavigation("/panier")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 gradient-secondary rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            {/* Profil & Logout Desktop */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate("/profil")}
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                   <LogOut className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            ) : (
              <Button className="hidden md:flex gradient-primary shadow-primary" asChild>
                <Link to="/connexion">Connexion</Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden py-4 border-t animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg font-medium hover:bg-muted flex items-center gap-2",
                    location.pathname === link.href ? "gradient-primary text-primary-foreground" : ""
                  )}
                >
                  {link.href === "/publier" && <PlusCircle className="h-4 w-4" />}
                  {link.label}
                </Link>
              ))}
              <hr className="my-2" />
              
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleProtectedNavigation("/profil")}
                    className="px-4 py-3 rounded-lg font-medium hover:bg-muted flex items-center gap-2 w-full text-left"
                  >
                    <User className="h-4 w-4" /> Mon Profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="mx-4 py-3 rounded-lg font-medium text-center bg-destructive/10 text-destructive mt-2"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  to="/connexion"
                  onClick={() => setIsOpen(false)}
                  className="mx-4 py-3 rounded-lg font-medium text-center gradient-primary text-white"
                >
                  Connexion
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}