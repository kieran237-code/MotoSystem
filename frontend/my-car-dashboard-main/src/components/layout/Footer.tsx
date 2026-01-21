import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  navigation: [
    { href: "/", label: "Accueil" },
    { href: "/catalogue", label: "Catalogue" },
    { href: "/recherche", label: "Recherche Avancée" },
  ],
  account: [
    { href: "/connexion", label: "Connexion" },
    { href: "/inscription", label: "Inscription" },
    { href: "/commandes", label: "Mes Commandes" },
    { href: "/profil", label: "Mon Profil" },
  ],
  legal: [
    { href: "#", label: "Mentions Légales" },
    { href: "#", label: "CGV" },
    { href: "#", label: "Politique de Confidentialité" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-xl">🚗</span>
              </div>
              <span className="font-display text-2xl text-primary">My_Car</span>
            </Link>
            <p className="text-background/70 text-sm mb-6">
              Votre partenaire de confiance pour l'achat de véhicules neufs. 
              Automobiles et scooters, essence ou électrique.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Mon Compte</h3>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-background/70 text-sm">
                <MapPin className="w-5 h-5 text-primary" />
                123 Avenue des Véhicules, Paris
              </li>
              <li>
                <a
                  href="tel:+33123456789"
                  className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors text-sm"
                >
                  <Phone className="w-5 h-5 text-primary" />
                  +33 1 23 45 67 89
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@mycar.fr"
                  className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors text-sm"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  contact@mycar.fr
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/50 text-sm text-center md:text-left">
              © 2026 My_Car. Tous droits réservés. Projet INF4067.
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-background/50 hover:text-primary text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
