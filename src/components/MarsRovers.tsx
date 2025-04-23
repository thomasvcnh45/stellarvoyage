
import { useState } from "react";
import { useMarsRoverPhotos } from "@/hooks/useNasaData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ChevronLeft, ChevronRight, Calendar, Camera } from "lucide-react";

interface RoverInfo {
  name: string;
  description: string;
  landingDate: string;
  status: string;
  cameras: {
    name: string;
    fullName: string;
  }[];
}

const rovers: Record<string, RoverInfo> = {
  curiosity: {
    name: "Curiosity",
    description: "Mars Science Laboratory Curiosity, le plus grand rover envoyé sur Mars, explore le cratère Gale depuis 2012.",
    landingDate: "6 août 2012",
    status: "Active",
    cameras: [
      { name: "FHAZ", fullName: "Front Hazard Avoidance Camera" },
      { name: "RHAZ", fullName: "Rear Hazard Avoidance Camera" },
      { name: "MAST", fullName: "Mast Camera" },
      { name: "CHEMCAM", fullName: "Chemistry and Camera Complex" },
      { name: "MAHLI", fullName: "Mars Hand Lens Imager" },
      { name: "MARDI", fullName: "Mars Descent Imager" },
      { name: "NAVCAM", fullName: "Navigation Camera" },
    ],
  },
  perseverance: {
    name: "Perseverance",
    description: "Rover de la mission Mars 2020, Perseverance cherche des signes d'habitabilité passée et collecte des échantillons.",
    landingDate: "18 février 2021",
    status: "Active",
    cameras: [
      { name: "FRONT_HAZCAM_LEFT_A", fullName: "Front Hazard Avoidance Camera - Left" },
      { name: "FRONT_HAZCAM_RIGHT_A", fullName: "Front Hazard Avoidance Camera - Right" },
      { name: "REAR_HAZCAM_LEFT", fullName: "Rear Hazard Avoidance Camera - Left" },
      { name: "REAR_HAZCAM_RIGHT", fullName: "Rear Hazard Avoidance Camera - Right" },
      { name: "NAVCAM_LEFT", fullName: "Navigation Camera - Left" },
      { name: "NAVCAM_RIGHT", fullName: "Navigation Camera - Right" },
      { name: "MCZ_LEFT", fullName: "Mastcam-Z Left" },
      { name: "MCZ_RIGHT", fullName: "Mastcam-Z Right" },
      { name: "SKYCAM", fullName: "MEDA Skycam" },
      { name: "SHERLOC_WATSON", fullName: "SHERLOC Watson Camera" },
    ],
  },
  opportunity: {
    name: "Opportunity",
    description: "Partie de la mission Mars Exploration Rovers, Opportunity a exploré Mars de 2004 à 2018.",
    landingDate: "25 janvier 2004",
    status: "Inactive (2018)",
    cameras: [
      { name: "FHAZ", fullName: "Front Hazard Avoidance Camera" },
      { name: "RHAZ", fullName: "Rear Hazard Avoidance Camera" },
      { name: "NAVCAM", fullName: "Navigation Camera" },
      { name: "PANCAM", fullName: "Panoramic Camera" },
      { name: "MINITES", fullName: "Miniature Thermal Emission Spectrometer" },
    ],
  },
  spirit: {
    name: "Spirit",
    description: "Jumeau d'Opportunity, Spirit a exploré le cratère Gusev de 2004 à 2010.",
    landingDate: "4 janvier 2004",
    status: "Inactive (2010)",
    cameras: [
      { name: "FHAZ", fullName: "Front Hazard Avoidance Camera" },
      { name: "RHAZ", fullName: "Rear Hazard Avoidance Camera" },
      { name: "NAVCAM", fullName: "Navigation Camera" },
      { name: "PANCAM", fullName: "Panoramic Camera" },
      { name: "MINITES", fullName: "Miniature Thermal Emission Spectrometer" },
    ],
  },
};

const MarsRovers = () => {
  const [selectedRover, setSelectedRover] = useState("curiosity");
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [sol, setSol] = useState(1000);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data, isLoading, isError } = useMarsRoverPhotos(
    selectedRover,
    sol,
    selectedCamera,
    page
  );

  const handleSolChange = (delta: number) => {
    setSol((prevSol) => Math.max(1, prevSol + delta));
    setPage(1);
  };

  const handlePageChange = (delta: number) => {
    setPage((prevPage) => Math.max(1, prevPage + delta));
  };

  const photos = data?.photos || [];
  const hasPhotos = photos.length > 0;
  const hasNextPage = photos.length === 25; // Assuming 25 per page
  const rover = rovers[selectedRover];

  return (
    <div className="space-section">
      <h2 className="text-2xl font-bold text-gradient glow-text mb-6">Exploration martienne</h2>
      
      <Tabs defaultValue="curiosity" onValueChange={setSelectedRover} className="mb-8">
        <TabsList className="bg-space/50 border border-space-blue/30">
          {Object.keys(rovers).map((roverId) => (
            <TabsTrigger
              key={roverId}
              value={roverId}
              className="data-[state=active]:bg-space-blue data-[state=active]:text-white"
            >
              {rovers[roverId].name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.keys(rovers).map((roverId) => (
          <TabsContent key={roverId} value={roverId}>
            <Card className="bg-space/50 border-space-blue/20 backdrop-blur-md">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="bg-space border border-space-blue/30 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-space-accent">{rovers[roverId].name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Atterrissage: {rovers[roverId].landingDate}
                      </p>
                      <p className="mb-4 text-white/80">{rovers[roverId].description}</p>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${
                            rovers[roverId].status === "Active"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        <p className="text-sm">
                          {rovers[roverId].status}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          <Calendar className="h-4 w-4 inline-block mr-1" /> 
                          Sol martien
                        </label>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSolChange(-10)}
                            className="border-space-blue/30 text-space-accent hover:bg-space-blue/20"
                          >
                            -10
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSolChange(-1)}
                            className="border-space-blue/30 text-space-accent hover:bg-space-blue/20"
                          >
                            -1
                          </Button>
                          <span className="px-2 py-1 bg-space border border-space-blue/30 rounded-md min-w-[60px] text-center">
                            {sol}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSolChange(1)}
                            className="border-space-blue/30 text-space-accent hover:bg-space-blue/20"
                          >
                            +1
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSolChange(10)}
                            className="border-space-blue/30 text-space-accent hover:bg-space-blue/20"
                          >
                            +10
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Un sol est un jour martien (24h39m)
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          <Camera className="h-4 w-4 inline-block mr-1" /> 
                          Caméra
                        </label>
                        <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                          <SelectTrigger className="bg-space border-space-blue/30">
                            <SelectValue placeholder="Toutes les caméras" />
                          </SelectTrigger>
                          <SelectContent className="bg-space border-space-blue/30">
                            <SelectItem value="all_cameras">Toutes les caméras</SelectItem>
                            {rovers[roverId].cameras.map((camera) => (
                              <SelectItem key={camera.name} value={camera.name}>
                                {camera.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    {isLoading && (
                      <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-space-accent" />
                        <p className="mt-4 text-space-accent">Chargement des photos...</p>
                      </div>
                    )}
                    
                    {isError && (
                      <div className="flex flex-col items-center justify-center h-64">
                        <p className="text-destructive">
                          Une erreur est survenue lors du chargement des photos.
                        </p>
                        <Button 
                          onClick={() => setPage(1)} 
                          className="mt-4 bg-space-blue hover:bg-space-blue/80"
                        >
                          Réessayer
                        </Button>
                      </div>
                    )}
                    
                    {!isLoading && !isError && !hasPhotos && (
                      <div className="flex flex-col items-center justify-center h-64 border border-dashed border-space-blue/30 rounded-lg">
                        <p className="text-muted-foreground">
                          Aucune photo disponible pour cette sélection.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Essayez un autre sol ou une autre caméra.
                        </p>
                      </div>
                    )}
                    
                    {!isLoading && !isError && hasPhotos && (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {photos.map((photo: any) => (
                            <div 
                              key={photo.id} 
                              className="space-card cursor-pointer"
                              onClick={() => setSelectedImage(photo.img_src)}
                            >
                              <img
                                src={photo.img_src}
                                alt={`Mars photo by ${selectedRover}`}
                                className="w-full aspect-square object-cover rounded-lg"
                              />
                              <div className="p-2">
                                <p className="text-xs text-space-accent truncate">
                                  {photo.camera.full_name}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-center mt-6 space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(-1)}
                            disabled={page === 1}
                            className="border-space-blue/30 text-space-accent hover:bg-space-blue/20"
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
                          </Button>
                          <span className="inline-flex items-center px-3 py-1 border border-space-blue/30 rounded-md text-sm">
                            Page {page}
                          </span>
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(1)}
                            disabled={!hasNextPage}
                            className="border-space-blue/30 text-space-accent hover:bg-space-blue/20"
                          >
                            Suivant <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="bg-space border-space-blue/30 max-w-4xl">
          <DialogHeader>
            <DialogTitle>Photo de Mars par {rovers[selectedRover].name}</DialogTitle>
          </DialogHeader>
          <div className="relative">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Mars surface"
                className="w-full object-contain max-h-[70vh]"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarsRovers;
