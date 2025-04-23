
import { useEffect, useState } from "react";

interface Star {
  id: number;
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

interface StarFieldProps {
  starCount?: number;
}

const StarField = ({ starCount = 100 }: StarFieldProps) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars: Star[] = [];
    
    for (let i = 0; i < starCount; i++) {
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const size = `${Math.random() * 2 + 1}px`;
      const delay = `${Math.random() * 5}s`;
      const duration = `${Math.random() * 3 + 2}s`;
      
      generatedStars.push({
        id: i,
        top,
        left,
        size,
        delay,
        duration,
      });
    }
    
    setStars(generatedStars);
  }, [starCount]);
  
  // Générer quelques étoiles filantes occasionnellement
  const [shootingStars, setShootingStars] = useState<{id: number, top: string, left: string}[]>([]);
  
  useEffect(() => {
    const shootingStarInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const top = `${Math.random() * 50}%`;
        const left = `${Math.random() * 50}%`;
        
        setShootingStars(prev => [
          ...prev, 
          { id: Date.now(), top, left }
        ]);
        
        // Supprimer l'étoile filante après l'animation
        setTimeout(() => {
          setShootingStars(prev => prev.filter(star => star.id !== Date.now()));
        }, 1000);
      }
    }, 3000);
    
    return () => clearInterval(shootingStarInterval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            '--star-size': star.size,
            '--star-delay': star.delay,
            '--star-duration': star.duration,
          } as React.CSSProperties}
        />
      ))}
      
      {shootingStars.map(star => (
        <div 
          key={star.id}
          className="absolute w-1 h-1 bg-white animate-shooting-star"
          style={{
            top: star.top,
            left: star.left,
            boxShadow: '0 0 4px 2px rgba(255, 255, 255, 0.7)',
          }}
        />
      ))}
    </div>
  );
};

export default StarField;
