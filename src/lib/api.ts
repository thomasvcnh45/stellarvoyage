const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;
const API_BASE_URL = "https://api.nasa.gov";

/**
 * Service pour interagir avec les APIs de la NASA
 */
export const nasaApi = {
  /**
   * Récupère l'image astronomique du jour (APOD)
   */
  getAstronomyPictureOfDay: async (date?: string) => {
    const params = new URLSearchParams({
      api_key: NASA_API_KEY,
      ...(date ? { date } : {})
    });
    
    const response = await fetch(`${API_BASE_URL}/planetary/apod?${params}`);
    return response.json();
  },

  /**
   * Recherche des images dans la NASA Image and Video Library
   */
  searchImages: async (query: string, page = 1) => {
    const response = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page=${page}`
    );
    return response.json();
  },

  /**
   * Récupère les données des rovers martiens
   */
  getMarsRoverPhotos: async (roverName: string, sol?: number, camera?: string, page = 1) => {
    const params = new URLSearchParams({
      api_key: NASA_API_KEY,
      page: String(page),
      ...(sol !== undefined ? { sol: String(sol) } : {}),
      ...(camera ? { camera } : {})
    });
    
    const response = await fetch(
      `${API_BASE_URL}/mars-photos/api/v1/rovers/${roverName}/photos?${params}`
    );
    return response.json();
  },

  /**
   * Récupère les données sur les astéroïdes proches de la Terre
   */
  getNearEarthObjects: async (startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      api_key: NASA_API_KEY,
      start_date: startDate,
      end_date: endDate
    });
    
    const response = await fetch(`${API_BASE_URL}/neo/rest/v1/feed?${params}`);
    return response.json();
  },

  /**
   * Récupère la position actuelle de l'ISS (Station Spatiale Internationale)
   */
  getISSCurrentLocation: async () => {
    try {
      console.log("Fetching ISS location");
      const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching ISS location: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("ISS data received:", data);
      
      return {
        iss_position: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
        timestamp: data.timestamp,
        velocity: data.velocity,
        altitude: data.altitude,
        visibility: data.visibility
      };
    } catch (error) {
      console.error("ISS API error:", error);
      throw error;
    }
  }
};