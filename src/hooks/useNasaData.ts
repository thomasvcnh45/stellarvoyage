
import { useQuery } from "@tanstack/react-query";
import { nasaApi } from "@/lib/api";

export const useAstronomyPictureOfDay = (date?: string) => {
  return useQuery({
    queryKey: ["apod", date],
    queryFn: () => nasaApi.getAstronomyPictureOfDay(date),
  });
};

export const useNasaImageSearch = (query: string, page = 1) => {
  return useQuery({
    queryKey: ["nasa-images", query, page],
    queryFn: () => nasaApi.searchImages(query, page),
    enabled: query.length > 0,
  });
};

export const useMarsRoverPhotos = (roverName: string, sol?: number, camera?: string, page = 1) => {
  // Handle the "all_cameras" special value as empty string for the API
  const cameraParam = camera === "all_cameras" ? "" : camera;
  
  return useQuery({
    queryKey: ["mars-rover", roverName, sol, camera, page],
    queryFn: () => nasaApi.getMarsRoverPhotos(roverName, sol, cameraParam, page),
  });
};

export const useNearEarthObjects = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["neo", startDate, endDate],
    queryFn: () => nasaApi.getNearEarthObjects(startDate, endDate),
  });
};

export const useISSLocation = (refreshInterval = 5000) => {
  return useQuery({
    queryKey: ["iss-location"],
    queryFn: async () => {
      try {
        return await nasaApi.getISSCurrentLocation();
      } catch (error) {
        console.error("Error fetching ISS location:", error);
        throw error;
      }
    },
    refetchInterval: refreshInterval,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
