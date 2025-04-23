import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Accueil", href: "/" },
    { name: "Image du Jour", href: "/apod" },
    { name: "Galerie", href: "/gallery" },
    { name: "Mars Rovers", href: "/mars-rovers" },
    { name: "ISS Tracker", href: "/iss-tracker" },
    { name: "Astéroïdes", href: "/asteroids" },
  ];

  return (
    <header
      className="fixed top-6 left-0 right-0 z-50 transition-all duration-300 bg-transparent"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-space-accent" />
            <Link to="/" className="text-xl font-bold text-gradient">
              StellarVoyage
            </Link>
          </div>

          {/* Menu sur desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-white/80 hover:text-space-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Bouton de menu mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white/80"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-space-dark border-t border-space-blue/20">
          <div className="container mx-auto py-4 px-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-2 text-white/80 hover:text-space-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;