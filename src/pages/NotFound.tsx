
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 space-section max-w-md mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-gradient glow-text">404</h1>
          <p className="text-xl text-white/80 mb-8">
            Cette page semble s'être perdue dans l'espace...
          </p>
          <Link to="/">
            <Button className="bg-space-blue hover:bg-space-blue/80">
              Retourner à l'accueil
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
