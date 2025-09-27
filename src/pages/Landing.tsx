import { HeroButton } from "@/components/ui/hero-button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Video } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication and show appropriate content
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white to-sage-light">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-light text-sage">Look Inwards</div>
          <div className="flex gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground self-center">
                  Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : user ? (
          /* Logged-in User: Show Conversation Options */
          <section className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto">
              {/* Welcome Section */}
              <div className="text-center mb-12">
                <h1 className="text-hero mb-8">
                  Ready to Connect?
                </h1>
                <p className="text-subtitle mb-12 max-w-3xl mx-auto">
                  Choose how you'd like to engage with your aspirational self today.
                </p>
              </div>

              {/* Conversation Options */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Text Chat Option */}
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-sage/20"
                      onClick={() => navigate("/chat")}>
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sage/20 transition-colors">
                      <MessageCircle className="h-8 w-8 text-sage" />
                    </div>
                    <CardTitle className="text-xl font-medium">Chat with Text & Voice</CardTitle>
                    <CardDescription className="text-base">
                      Type or speak your thoughts and receive thoughtful written responses with optional voice playback
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Text conversation
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Speech recognition
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Text-to-speech responses
                      </div>
                    </div>
                    <Button className="w-full group-hover:bg-sage group-hover:text-white transition-colors">
                      Start Text Chat
                    </Button>
                  </CardContent>
                </Card>

                {/* Video Avatar Option */}
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-sage/20"
                      onClick={() => navigate("/avatar")}>
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sage/20 transition-colors">
                      <Video className="h-8 w-8 text-sage" />
                    </div>
                    <CardTitle className="text-xl font-medium">Talk in Video</CardTitle>
                    <CardDescription className="text-base">
                      Have a face-to-face conversation with your AI avatar companion using real-time video
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Real-time video avatar
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Voice-only interaction
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        Experimental feature
                      </div>
                    </div>
                    <Button className="w-full group-hover:bg-sage group-hover:text-white transition-colors">
                      Talk in Video
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Info */}
              <div className="text-center mt-12">
                <p className="text-sm text-muted-foreground">
                  Both options connect you with the same aspirational self, just through different mediums
                </p>
              </div>
            </div>
          </section>
        ) : (
          /* Not Logged In: Show Landing Content */
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
        )}

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