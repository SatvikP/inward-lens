import { HeroButton } from "@/components/ui/hero-button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white to-sage-light">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-light text-sage">Look Inwards</div>
          <div className="flex gap-4">
            <HeroButton
              variant="ghost"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </HeroButton>
            <HeroButton
              variant="outline"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </HeroButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-20">
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-5xl mx-auto animate-fade-in">
            <h1 className="text-hero mb-8">
              Look Inwards
            </h1>
            <p className="text-subtitle mb-12 max-w-3xl mx-auto animate-slide-up">
              talk to your shades and navigate life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up">
              <HeroButton
                variant="primary"
                onClick={() => navigate("/auth")}
                className="text-lg"
              >
                Start Your Journey
              </HeroButton>
              <HeroButton
                variant="ghost"
                onClick={() => navigate("/auth")}
                className="text-lg"
              >
                Learn More
              </HeroButton>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="animate-slide-up">
                <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-sage rounded-full"></div>
                </div>
                <h3 className="text-xl font-medium mb-4">Gentle Guidance</h3>
                <p className="text-muted-foreground">
                  Your avatar asks thoughtful questions to help you discover your own answers.
                </p>
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-sage rounded-full"></div>
                </div>
                <h3 className="text-xl font-medium mb-4">Safe Space</h3>
                <p className="text-muted-foreground">
                  A private, judgment-free environment for honest self-reflection.
                </p>
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
                <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-sage rounded-full"></div>
                </div>
                <h3 className="text-xl font-medium mb-4">Your Pace</h3>
                <p className="text-muted-foreground">
                  Take time to process and respond. No pressure, just presence.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; 2024 Look Inwards. A space for gentle self-discovery.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;