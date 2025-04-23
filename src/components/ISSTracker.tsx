import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw, Info, Radio, Satellite } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { nasaApi } from "@/lib/api";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correction des icônes Leaflet (problème connu)
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Define TypeScript interface for ISS position data
interface ISSPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
  velocity: number;
  altitude: number;
  visibility: string;
}

// Composant pour suivre l'ISS et centrer la carte
const ISSMarkerWithUpdates = ({ position, followISS }: { position: ISSPosition, followISS: boolean }) => {
  const map = useMap();
  
  // Créer une icône personnalisée pour l'ISS
  const issIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/International_Space_Station.svg/200px-International_Space_Station.svg.png',
    iconSize: [40, 25],
    iconAnchor: [20, 12],
    popupAnchor: [0, -12]
  });
  
  useEffect(() => {
    if (followISS && position) {
      map.setView([position.latitude, position.longitude], map.getZoom());
    }
  }, [position, followISS, map]);

  if (!position) return null;
  
  return (
    <Marker 
      position={[position.latitude, position.longitude]} 
      icon={issIcon}
    >
      <Popup>
        ISS est ici<br/>
        Altitude: {Math.round(position.altitude)} km<br/>
        Vitesse: {Math.round(position.velocity)} km/h
      </Popup>
    </Marker>
  );
};

const ISSTracker = () => {
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(1000);
  const [followISS, setFollowISS] = useState(true);
  const { toast } = useToast();
  const pathRef = useRef<L.LatLng[]>([]);

  // Effet pour récupérer la position de l'ISS périodiquement
  useEffect(() => {
    let isMounted = true;
    
    const fetchISSPosition = async () => {
      try {
        if (!isMounted) return;
        
        console.log("Fetching ISS position...");
        const data = await nasaApi.getISSCurrentLocation();
        
        if (!isMounted) return;
        
        if (!data || !data.iss_position || 
            typeof data.iss_position.latitude === 'undefined' || 
            typeof data.iss_position.longitude === 'undefined') {
          throw new Error("Invalid ISS position data");
        }
        
        // Convertir des valeurs de chaîne en nombres
        const position: ISSPosition = {
          latitude: parseFloat(data.iss_position.latitude),
          longitude: parseFloat(data.iss_position.longitude),
          timestamp: data.timestamp,
          velocity: data.velocity,
          altitude: data.altitude,
          visibility: data.visibility
        };
        
        console.log("ISS position updated:", position);
        setIssPosition(position);
        setError(null);
      } catch (err) {
        console.error('Error fetching ISS position:', err);
        if (isMounted) {
          setError('Impossible de récupérer la position de l\'ISS');
          toast({
            title: "Erreur",
            description: "Impossible de récupérer la position de l'ISS",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchISSPosition();
    
    // Set up interval for periodic updates
    const interval = setInterval(fetchISSPosition, refreshInterval);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [refreshInterval, toast]);

  const handleRefreshRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newInterval = Number(e.target.value);
    setRefreshInterval(newInterval);
    toast({
      title: "Taux de rafraîchissement mis à jour",
      description: `Les données seront actualisées toutes les ${newInterval/1000} secondes`,
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  // Résoudre le problème connu des icônes par défaut de Leaflet
  useEffect(() => {
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  return (
    <div className="space-section">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gradient glow-text mb-4 md:mb-0">Suivi de l'ISS en Temps Réel</h2>
        <div className="flex items-center space-x-3">
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative">
          {(loading && !issPosition) && (
            <div className="absolute inset-0 flex items-center justify-center bg-space-dark/40 rounded-lg z-10">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-space-accent" />
                <p className="mt-2 text-space-accent">Chargement des données...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-space-dark/40 rounded-lg z-10">
              <div className="flex flex-col items-center">
                <p className="text-destructive">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-space-blue hover:bg-space-blue/80"
                >
                  Réessayer
                </Button>
              </div>
            </div>
          )}
          
          <div className="w-full h-[500px] rounded-lg overflow-hidden border border-space-blue/30 animate-pulse-glow">
            {issPosition ? (
              <MapContainer 
                center={[issPosition.latitude, issPosition.longitude]} 
                zoom={3} 
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ISSMarkerWithUpdates position={issPosition} followISS={followISS} />
              </MapContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-space-dark">
                <p>Chargement de la carte...</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-space/80 backdrop-blur-md p-6 rounded-lg border border-space-blue/30">
            <h3 className="text-lg font-bold flex items-center space-x-2 mb-4">
              <Satellite className="h-5 w-5 text-space-accent" />
              <span>Position de l'ISS</span>
            </h3>
            
            {issPosition ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Latitude</p>
                  <p className="text-xl font-mono">{issPosition.latitude.toFixed(4)}°</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Longitude</p>
                  <p className="text-xl font-mono">{issPosition.longitude.toFixed(4)}°</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Altitude</p>
                  <p className="text-xl font-mono">{Math.round(issPosition.altitude)} km</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Vitesse</p>
                  <p className="text-xl font-mono">{Math.round(issPosition.velocity)} km/h</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                  <p className="font-mono">{formatTime(issPosition.timestamp)}</p>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Radio className="h-4 w-4 text-space-accent animate-pulse" />
                  <p className="text-space-accent font-medium">Status: En orbite</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
              </div>
            )}
          </div>
          
          <div className="bg-space/80 backdrop-blur-md p-6 rounded-lg border border-space-blue/30">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Info className="h-5 w-5 text-space-accent mr-2" />
              À propos de l'ISS
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La Station Spatiale Internationale voyage à une altitude d'environ 400 km 
              et à une vitesse de 28 000 km/h, complétant 15,5 orbites par jour autour 
              de la Terre. Elle est habitée en permanence depuis novembre 2000.
            </p>
            <div className="mt-4">
              <a 
                href="https://www.nasa.gov/international-space-station/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-space-accent hover:underline text-sm flex items-center"
              >
                En savoir plus sur l'ISS
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISSTracker;