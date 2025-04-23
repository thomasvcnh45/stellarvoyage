
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-space-dark border-t border-space-blue/20 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-gradient">
              StellarVoyage
            </h3>
            <p className="text-muted-foreground mt-2">
              Explorez les données de la NASA et les merveilles de l'univers
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-muted-foreground mb-2">
              Propulsé par les APIs de la NASA
            </p>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-white/70 hover:text-space-accent"
                onClick={() => window.open("https://api.nasa.gov/", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                API NASA
              </Button>
              <Button 
                variant="ghost" 
                className="text-white/70 hover:text-space-accent"
                onClick={() => window.open("https://www.nasa.gov/", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                NASA
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-space-blue/20 mt-6 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 StellarVoyage. Toutes les images appartiennent à la NASA et sont du domaine public.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
