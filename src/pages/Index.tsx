
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const Index = () => {
  // Animation au défilement
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    const hiddenElements = document.querySelectorAll(".hidden-section");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center relative pt-16"
      >
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ 
              backgroundImage: "url(https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80)" 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space to-space-dark" />
        </div>

        <div className="container mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gradient glow-text animate-fade-in-up">
            Stellar<span className="text-space-accent">Voyage</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8 animate-fade-in-up delay-100">
            Plongez dans l'univers avec les données de la NASA. Explorez les merveilles du cosmos, des images époustouflantes aux données en temps réel.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-200">
            <Link to="/gallery">
              <Button
                className="bg-space-blue hover:bg-space-blue/80 text-lg px-6 py-6"
              >
                Commencer l'exploration
              </Button>
            </Link>
            <Button
              variant="outline"
              className="text-lg border-space-blue/50 text-space-accent hover:bg-space-blue/20 px-6 py-6"
              onClick={() => window.open("https://api.nasa.gov/", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              API NASA
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-8 w-8 text-space-accent" />
        </div>
      </section>

      {/* Feature Sections */}
      <section className="py-24 container mx-auto px-4 hidden-section">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient glow-text">
          Explorez l'Univers
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="Image du Jour" 
            description="Découvrez l'image astronomique du jour sélectionnée par la NASA."
            link="/apod"
          />
          <FeatureCard 
            title="Galerie Spatiale" 
            description="Parcourez une collection d'images fascinantes de l'espace."
            link="/gallery"
          />
          <FeatureCard 
            title="Rovers Martiens" 
            description="Explorez la surface de Mars à travers les yeux des rovers."
            link="/mars-rovers"
          />
          <FeatureCard 
            title="Suivi de l'ISS" 
            description="Suivez la Station Spatiale Internationale en temps réel."
            link="/iss-tracker"
          />
          <FeatureCard 
            title="Astéroïdes" 
            description="Informez-vous sur les astéroïdes qui passent près de la Terre."
            link="/asteroids"
          />
          <FeatureCard 
            title="En développement" 
            description="D'autres fonctionnalités spatiales arrivent bientôt!"
            link="/"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-space-dark border-t border-space-blue/20 py-12">
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
                  API NASA
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-white/70 hover:text-space-accent"
                  onClick={() => window.open("https://www.nasa.gov/", "_blank")}
                >
                  NASA
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-space-blue/20 mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 StellarVoyage. Toutes les images appartiennent à la NASA et sont du domaine public.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Composant de carte de fonctionnalité
const FeatureCard = ({ title, description, link }: { title: string; description: string; link: string }) => (
  <Link to={link} className="group">
    <div className="bg-space/50 border border-space-blue/30 rounded-lg p-6 h-full hover:bg-space-blue/20 transition-colors hover:border-space-blue/50">
      <h3 className="text-xl font-semibold mb-3 text-space-accent">{title}</h3>
      <p className="text-white/70 mb-4">{description}</p>
      <p className="text-sm text-space-accent group-hover:underline">Explorer &rarr;</p>
    </div>
  </Link>
);

export default Index;
