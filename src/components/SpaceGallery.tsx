
import { useState } from "react";
import { useNasaImageSearch } from "@/hooks/useNasaData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import GalleryItem from "./GalleryItem";

const suggestedSearches = [
  "galaxy", 
  "nebula",
  "black hole",
  "supernova",
  "aurora",
  "earth",
  "jupiter",
];

const SpaceGallery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("galaxy");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useNasaImageSearch(activeQuery, page);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveQuery(searchQuery);
      setPage(1);
    }
  };

  const handleSuggestedSearch = (query: string) => {
    setSearchQuery(query);
    setActiveQuery(query);
    setPage(1);
  };

  // Fonction pour formater le nombre total de résultats
  const formatTotalResults = (total: number) => {
    if (total > 1000) {
      return "1000+";
    }
    return total.toString();
  };

  const items = data?.collection?.items || [];
  const totalResults = data?.collection?.metadata?.total_hits || 0;
  const hasNextPage = items.length === 100; // NASA API limite à 100 résultats par page

  return (
    <div className="space-section">
      <h2 className="text-2xl font-bold text-gradient glow-text mb-6">Galerie d'images cosmiques</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher des images (ex: galaxy, mars, asteroid...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-space-blue/30 bg-space/50 backdrop-blur-sm focus:border-space-blue focus:ring-space-accent"
            />
          </div>
          <Button type="submit" className="bg-space-blue hover:bg-space-blue/80 shrink-0">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rechercher"}
          </Button>
        </div>
      </form>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {suggestedSearches.map((query) => (
          <Button
            key={query}
            variant={query === activeQuery ? "default" : "outline"}
            size="sm"
            className={
              query === activeQuery
                ? "bg-space-blue hover:bg-space-blue/80"
                : "border-space-blue/30 text-space-accent hover:bg-space-blue/20"
            }
            onClick={() => handleSuggestedSearch(query)}
          >
            {query}
          </Button>
        ))}
      </div>
      
      {/* Résultats de recherche */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <Globe className="h-16 w-16 text-space-accent animate-pulse" />
            <div className="absolute inset-0 animate-rotate-slow">
              <div className="w-full h-full border border-space-blue/50 rounded-full" style={{ borderTopColor: 'transparent' }} />
            </div>
          </div>
          <p className="mt-4 text-space-accent">Chargement des images...</p>
        </div>
      )}
      
      {isError && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-destructive">Une erreur est survenue lors du chargement des images.</p>
          <Button 
            onClick={() => setActiveQuery(activeQuery)} 
            className="mt-4 bg-space-blue hover:bg-space-blue/80"
          >
            Réessayer
          </Button>
        </div>
      )}
      
      {!isLoading && !isError && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Aucune image trouvée pour "{activeQuery}"</p>
        </div>
      )}
      
      {!isLoading && !isError && items.length > 0 && (
        <>
          <div className="text-sm text-muted-foreground mb-4">
            {formatTotalResults(totalResults)} résultats pour "{activeQuery}" · Page {page}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => {
              const data = item.data[0];
              const links = item.links || [];
              const imageLink = links.find((link: any) => link.rel === 'preview')?.href;
              
              if (!imageLink) return null;
              
              return (
                <GalleryItem
                  key={data.nasa_id}
                  title={data.title}
                  description={data.description || "Aucune description disponible."}
                  imageUrl={imageLink}
                  nasaId={data.nasa_id}
                  date={data.date_created}
                />
              );
            })}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="border-space-blue/30 text-space-accent hover:bg-space-blue/20"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNextPage}
              className="border-space-blue/30 text-space-accent hover:bg-space-blue/20"
            >
              Suivant <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SpaceGallery;
