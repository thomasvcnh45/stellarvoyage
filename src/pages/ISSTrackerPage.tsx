
import ISSTracker from "@/components/ISSTracker";

const ISSTrackerPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient glow-text">
          Suivi de l'ISS
        </h1>
        <ISSTracker />
      </div>
    </div>
  );
};

export default ISSTrackerPage;
