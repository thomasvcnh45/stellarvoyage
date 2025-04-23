
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Maximize2, Eye } from "lucide-react";

interface GalleryItemProps {
  title: string;
  description: string;
  imageUrl: string;
  nasaId: string;
  date: string;
}

const GalleryItem = ({
  title,
  description,
  imageUrl,
  nasaId,
  date,
}: GalleryItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const formattedDescription = description.length > 120 
    ? description.substring(0, 120) + "..."
    : description;

  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Card className="space-card group h-full">
        <CardContent className="p-0 h-full flex flex-col overflow-hidden">
          <div className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-space-dark/60 flex items-center justify-center ${loaded ? 'hidden' : 'block'}`}>
              <div className="w-8 h-8 border-4 border-space-blue border-t-transparent rounded-full animate-spin" />
            </div>
            <img
              src={imageUrl}
              alt={title}
              className={`w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105 ${loaded ? 'block' : 'opacity-0'}`}
              onLoad={() => setLoaded(true)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-space-dark to-transparent h-24" />
          </div>
          
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-medium text-space-accent truncate">{title}</h3>
            <p className="text-xs text-muted-foreground mb-2">{formattedDate}</p>
            <p className="text-sm text-white/70 mb-4 flex-grow">{formattedDescription}</p>
            
            <div className="flex justify-end mt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(true)}
                className="text-space-accent hover:bg-space-blue/20 hover:text-white"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-space border-space-blue/30 max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gradient">{title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">{formattedDate}</DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-grow overflow-auto pr-4">
            <div className="relative mb-4">
              <img
                src={imageUrl.replace("thumb", "orig")}
                alt={title}
                className="w-full rounded-md object-contain max-h-[50vh]"
              />
            </div>
            
            <div>
              <p className="text-white/80 mb-4">{description}</p>
            </div>
          </ScrollArea>
          
          <div className="flex justify-end mt-4 pt-2 border-t border-space-blue/20">
            <Button
              className="bg-space-blue hover:bg-space-blue/80"
              onClick={() => window.open(imageUrl.replace("thumb", "orig"), "_blank")}
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir en HD
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryItem;
