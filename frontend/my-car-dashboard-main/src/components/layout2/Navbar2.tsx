import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/recherche", label: "Recherche" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const cartItemsCount = 3; // Maquette: valeur fictive

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
              <span className="text-xl">🚗</span>
            </div>
            <span className="font-display text-2xl text-gradient">My_Car</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-2",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
                {location.pathname === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search (Desktop) */}
            <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
              <Link to="/recherche">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/panier">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 gradient-secondary rounded-full text-xs font-bold text-secondary-foreground flex items-center justify-center animate-bounce-in">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Profile */}
            <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
              <Link to="/profil">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* CTA */}
            <Button className="hidden md:flex gradient-primary shadow-primary hover:opacity-90 transition-opacity" asChild>
              <Link to="/connexion">Connexion</Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
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
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg font-medium transition-colors",
                    location.pathname === link.href
                      ? "gradient-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2" />
              <Link
                to="/profil"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-lg font-medium hover:bg-muted flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Mon Profil
              </Link>
              <Link
                to="/connexion"
                onClick={() => setIsOpen(false)}
                className="mx-4 py-3 rounded-lg font-medium text-center gradient-primary text-primary-foreground"
              >
                Connexion
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
