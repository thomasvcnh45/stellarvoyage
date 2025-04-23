
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAstronomyPictureOfDay } from "@/hooks/useNasaData";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FIRST_NASA_APOD_YEAR = 1995; // La première image du jour de la NASA date de 1995-06-16

const AstronomyPictureOfDay = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined;
  const { data, isLoading, isError } = useAstronomyPictureOfDay(formattedDate);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleYearChange = (year: string) => {
    const yearNumber = parseInt(year);
    setSelectedYear(yearNumber);
    
    // Mise à jour du mois affiché dans le calendrier avec la nouvelle année
    setCalendarMonth(new Date(yearNumber, calendarMonth.getMonth(), 1));
  };

  useEffect(() => {
    // Si l'utilisateur sélectionne une date, mettre à jour l'année sélectionnée
    if (selectedDate) {
      setSelectedYear(selectedDate.getFullYear());
    }
  }, [selectedDate]);

  const today = new Date();
  const years = Array.from({ length: today.getFullYear() - FIRST_NASA_APOD_YEAR + 1 }, 
    (_, i) => (today.getFullYear() - i).toString());

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-section">
        <Loader2 className="h-12 w-12 animate-spin text-space-accent" />
        <p className="mt-4 text-space-accent">Chargement de l'image du jour...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-section">
        <p className="text-destructive">Une erreur est survenue lors du chargement de l'image.</p>
        <Button 
          onClick={() => setSelectedDate(undefined)} 
          className="mt-4 bg-space-blue hover:bg-space-blue/80"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-section animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gradient glow-text mb-2">{data.title}</h2>
          <p className="text-muted-foreground">
            {selectedDate 
              ? format(new Date(data.date), "d MMMM yyyy", { locale: fr })
              : "Aujourd'hui"}
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="border-space-blue/30 bg-space/50 backdrop-blur-sm hover:bg-space-blue/20 hover:border-space-blue/50 flex items-center gap-2"
              >
                <CalendarIcon className="h-4 w-4 text-space-accent" />
                {selectedDate ? (
                  format(selectedDate, "dd/MM/yyyy")
                ) : (
                  "Choisir une date"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-space-blue/30 bg-space/90 backdrop-blur-sm">
              <div className="p-3 flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="w-[100px] bg-space-blue/20 border-space-blue/30 focus:ring-space-accent/50">
                      <SelectValue placeholder="Année" />
                    </SelectTrigger>
                    <SelectContent className="bg-space/90 backdrop-blur-sm border-space-blue/30 text-white">
                      {years.map((year) => (
                        <SelectItem key={year} value={year} className="hover:bg-space-blue/20 focus:bg-space-blue/30">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  disabled={(date) => {
                    // Désactiver les dates futures et celles avant le premier APOD (16 juin 1995)
                    const firstApodDate = new Date(1995, 5, 16); // Juin est 5 (0-indexé)
                    return date > today || date < firstApodDate;
                  }}
                  initialFocus
                  className="pointer-events-auto"
                  classNames={{
                    day_today: "bg-space-blue/20 text-space-accent font-bold",
                    day_selected: "bg-space-blue text-white hover:bg-space-blue/90 hover:text-white",
                    day: cn(
                      "hover:bg-space-blue/20",
                      "aria-selected:opacity-100"
                    ),
                    head_cell: "text-space-accent/80 px-3",
                    caption: "flex justify-between pt-1 relative items-center px-2",
                    nav_button: cn(
                      "border border-space-blue/30 bg-space/50 hover:bg-space-blue/20 text-white"
                    ),
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card className="overflow-hidden border-space-blue/20 bg-space/50 backdrop-blur-md animate-pulse-glow">
        <CardContent className="p-0">
          {data.media_type === "image" ? (
            <div className="relative">
              <img
                src={data.url}
                alt={data.title}
                className="w-full h-auto object-cover rounded-t-lg"
                style={{ maxHeight: "600px" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-dark to-transparent opacity-40" />
            </div>
          ) : (
            <div className="relative aspect-video">
              <iframe
                src={data.url}
                title={data.title}
                className="w-full h-full rounded-t-lg"
                allowFullScreen
              />
            </div>
          )}
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{data.title}</h3>
            <p className="text-sm text-muted-foreground">
              {data.copyright ? `© ${data.copyright}` : "NASA"}
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">{data.explanation}</p>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => window.open(data.hdurl || data.url, "_blank")}
                className="bg-space-blue hover:bg-space-blue/80"
              >
                Voir en HD
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AstronomyPictureOfDay;
