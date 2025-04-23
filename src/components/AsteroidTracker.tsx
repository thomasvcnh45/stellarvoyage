
import { useState, useEffect } from "react";
import { useNearEarthObjects } from "@/hooks/useNasaData";
import { format, addDays, subDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Asterisk,
  Check,
  X,
} from "lucide-react";

const AsteroidTracker = () => {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), "yyyy-MM-dd"));
  const [activeTab, setActiveTab] = useState("list");

  const { data, isLoading, isError } = useNearEarthObjects(startDate, endDate);

  const handleDateChange = (days: number) => {
    const newStartDate = format(addDays(new Date(startDate), days), "yyyy-MM-dd");
    const newEndDate = format(addDays(new Date(newStartDate), 7), "yyyy-MM-dd");
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Formater les données pour l'affichage
  const processAsteroidData = () => {
    if (!data || !data.near_earth_objects) return [];

    let allAsteroids: any[] = [];
    
    Object.keys(data.near_earth_objects).forEach((date) => {
      data.near_earth_objects[date].forEach((asteroid: any) => {
        allAsteroids.push({
          id: asteroid.id,
          name: asteroid.name,
          date: date,
          diameter: {
            min: Math.round(asteroid.estimated_diameter.meters.estimated_diameter_min),
            max: Math.round(asteroid.estimated_diameter.meters.estimated_diameter_max),
          },
          distanceKm: Math.round(
            parseFloat(
              asteroid.close_approach_data[0].miss_distance.kilometers
            )
          ),
          relativeVelocity: Math.round(
            parseFloat(
              asteroid.close_approach_data[0].relative_velocity
                .kilometers_per_hour
            )
          ),
          isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid,
        });
      });
    });
    
    // Trier par distance (du plus proche au plus éloigné)
    allAsteroids.sort((a, b) => a.distanceKm - b.distanceKm);
    
    return allAsteroids;
  };

  const asteroids = processAsteroidData();
  
  // Calculer des statistiques
  const hazardousCount = asteroids.filter((a) => a.isPotentiallyHazardous).length;
  const totalCount = asteroids.length;
  const closestAsteroid = asteroids[0];
  const fastestAsteroid = asteroids.length > 0
    ? asteroids.reduce((prev, current) => (prev.relativeVelocity > current.relativeVelocity) ? prev : current)
    : null;
  const largestAsteroid = asteroids.length > 0
    ? asteroids.reduce((prev, current) => (prev.diameter.max > current.diameter.max) ? prev : current)
    : null;
    
  // Formater la distance pour l'affichage
  const formatDistance = (km: number) => {
    if (km < 1000000) {
      return `${(km).toLocaleString()} km`;
    } else {
      return `${(km / 1000000).toFixed(2)} millions km`;
    }
  };

  // Obtenir la classe de danger basée sur la distance
  const getDangerClass = (distanceKm: number, isHazardous: boolean) => {
    if (isHazardous) {
      return "text-red-400";
    }
    if (distanceKm < 1000000) {
      return "text-yellow-400";
    }
    return "text-green-400";
  };

  return (
    <div className="space-section">
      <h2 className="text-2xl font-bold text-gradient glow-text mb-6">Astéroïdes à proximité de la Terre</h2>
      
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 md:space-x-4 bg-space/50 p-4 rounded-lg border border-space-blue/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
            <Button
              variant="outline"
              onClick={() => handleDateChange(-7)}
              className="border-space-blue/30 text-space-accent hover:bg-space-blue/20 w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Semaine précédente
            </Button>
            
            <div className="bg-space border border-space-blue/30 rounded-md px-4 py-1.5 flex-grow text-center">
              <span className="text-sm text-muted-foreground mr-2">Période:</span>
              <span className="text-sm">
                {format(new Date(startDate), "dd/MM/yyyy")} - {format(new Date(endDate), "dd/MM/yyyy")}
              </span>
            </div>
            
            <Button
              variant="outline"
              onClick={() => handleDateChange(7)}
              className="border-space-blue/30 text-space-accent hover:bg-space-blue/20 w-full sm:w-auto"
            >
              Semaine suivante <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-space/50 border border-space-blue/30 w-full sm:w-auto">
            <TabsTrigger value="list" className="data-[state=active]:bg-space-blue data-[state=active]:text-white flex-1">
              Liste
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-space-blue data-[state=active]:text-white flex-1">
              Statistiques
            </TabsTrigger>
          </TabsList>
        
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 mt-4">
              <Loader2 className="h-8 w-8 animate-spin text-space-accent" />
              <p className="mt-4 text-space-accent">Chargement des données...</p>
            </div>
          )}
          
          {isError && (
            <div className="flex flex-col items-center justify-center h-64 mt-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="mt-2 text-destructive">
                Une erreur est survenue lors du chargement des données.
              </p>
              <Button 
                onClick={() => handleDateChange(0)} 
                className="mt-4 bg-space-blue hover:bg-space-blue/80"
              >
                Réessayer
              </Button>
            </div>
          )}
          
          {!isLoading && !isError && (
            <>
              <TabsContent value="list" className="mt-4">
                <Card className="bg-space/50 border-space-blue/20 backdrop-blur-md">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-space/80">
                          <TableRow className="hover:bg-transparent border-space-blue/20">
                            <TableHead className="text-space-accent">Nom</TableHead>
                            <TableHead className="text-space-accent">Date</TableHead>
                            <TableHead className="text-space-accent">Diamètre (m)</TableHead>
                            <TableHead className="text-space-accent">Distance</TableHead>
                            <TableHead className="text-space-accent">Vitesse (km/h)</TableHead>
                            <TableHead className="text-space-accent">Dangereux</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {asteroids.map((asteroid) => (
                            <TableRow 
                              key={`${asteroid.id}-${asteroid.date}`}
                              className="hover:bg-space-blue/10 border-space-blue/10"
                            >
                              <TableCell className="font-medium">
                                {asteroid.name.replace(/[()]/g, "")}
                              </TableCell>
                              <TableCell>
                                {format(new Date(asteroid.date), "dd/MM/yyyy")}
                              </TableCell>
                              <TableCell>
                                {asteroid.diameter.min} - {asteroid.diameter.max}
                              </TableCell>
                              <TableCell className={getDangerClass(asteroid.distanceKm, asteroid.isPotentiallyHazardous)}>
                                {formatDistance(asteroid.distanceKm)}
                              </TableCell>
                              <TableCell>
                                {asteroid.relativeVelocity.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {asteroid.isPotentiallyHazardous ? (
                                  <span className="flex items-center text-red-400">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Oui
                                  </span>
                                ) : (
                                  <span className="flex items-center text-green-400">
                                    <Check className="h-4 w-4 mr-1" />
                                    Non
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="stats" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-space/50 border-space-blue/20 backdrop-blur-md">
                    <CardContent className="p-6">
                      <h3 className="text-space-accent text-lg font-medium mb-3">Statistiques générales</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-space-blue/10 pb-2">
                          <span className="text-muted-foreground">Nombre total d'astéroïdes</span>
                          <span className="text-xl font-semibold">{totalCount}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-space-blue/10 pb-2">
                          <span className="text-muted-foreground">Astéroïdes potentiellement dangereux</span>
                          <span className="text-xl font-semibold text-red-400">{hazardousCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Pourcentage de danger</span>
                          <span className="text-xl font-semibold">
                            {totalCount > 0 ? Math.round((hazardousCount / totalCount) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {closestAsteroid && (
                    <Card className="bg-space/50 border-space-blue/20 backdrop-blur-md">
                      <CardContent className="p-6">
                        <h3 className="text-space-accent text-lg font-medium mb-3">Astéroïde le plus proche</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-space-blue/10 pb-2">
                            <span className="text-muted-foreground">Nom</span>
                            <span className="font-medium truncate max-w-[180px]">
                              {closestAsteroid.name.replace(/[()]/g, "")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-b border-space-blue/10 pb-2">
                            <span className="text-muted-foreground">Distance</span>
                            <span className="font-medium">
                              {formatDistance(closestAsteroid.distanceKm)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-b border-space-blue/10 pb-2">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium">
                              {format(new Date(closestAsteroid.date), "dd/MM/yyyy")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Dangereux</span>
                            <span className={`font-medium ${closestAsteroid.isPotentiallyHazardous ? 'text-red-400' : 'text-green-400'}`}>
                              {closestAsteroid.isPotentiallyHazardous ? "Oui" : "Non"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {fastestAsteroid && largestAsteroid && (
                    <Card className="bg-space/50 border-space-blue/20 backdrop-blur-md">
                      <CardContent className="p-6">
                        <h3 className="text-space-accent text-lg font-medium mb-3">Records</h3>
                        <div className="space-y-3">
                          <div className="border-b border-space-blue/10 pb-2">
                            <span className="text-muted-foreground">Plus rapide</span>
                            <div className="mt-1 flex justify-between">
                              <span className="font-medium truncate max-w-[180px]">
                                {fastestAsteroid.name.replace(/[()]/g, "")}
                              </span>
                              <span className="font-semibold">
                                {fastestAsteroid.relativeVelocity.toLocaleString()} km/h
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Plus grand</span>
                            <div className="mt-1 flex justify-between">
                              <span className="font-medium truncate max-w-[180px]">
                                {largestAsteroid.name.replace(/[()]/g, "")}
                              </span>
                              <span className="font-semibold">
                                {largestAsteroid.diameter.max} m
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AsteroidTracker;
