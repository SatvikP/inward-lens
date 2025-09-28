import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";

const Avatar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();
  const { agentType } = useParams<{ agentType: string }>();
  const { toast } = useToast();

  // Agent configurations
  const agentConfigs = {
    calm: {
      title: "Calm & Composed",
      description: "Your serene, balanced self focused on mindfulness and peace",
      embedUrl: "https://bey.chat/b24063de-dfba-4079-9138-ed115de5f37e",
      color: "blue"
    },
    driven: {
      title: "Driven & Disciplined",
      description: "Your ambitious, goal-oriented self pushing toward excellence",
      embedUrl: "https://bey.chat/1061dbe3-d1ce-4cd3-a890-85cc54c59e1d",
      color: "orange"
    },
    confident: {
      title: "Confident & Charismatic",
      description: "Your bold, inspiring self building confidence and leadership",
      embedUrl: "https://bey.chat/9080ce37-b46e-40cb-b6ef-39e71785bc71",
      color: "purple"
    }
  };

  const currentAgent = agentConfigs[agentType as keyof typeof agentConfigs] || agentConfigs.calm;

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "Take care of yourself.",
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white to-sage-light">
      {/* Header */}
      <header className="bg-background/90 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-xl font-light text-sage">{currentAgent.title}</h1>
              <p className="text-sm text-muted-foreground">
                {currentAgent.description}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className={isFullscreen ? "fixed inset-0 z-50 bg-black" : "max-w-6xl mx-auto p-6"}>
        <div className={isFullscreen ? "h-full" : "h-[calc(100vh-200px)]"}>
          
          {/* Video Avatar Container */}
          <Card className={`h-full ${isFullscreen ? "border-0 bg-black" : "bg-black/5 border-sage/20"}`}>
            <div className="relative h-full rounded-lg overflow-hidden">
              
              {/* Beyond Presence Avatar Iframe */}
              <iframe 
                src={currentAgent.embedUrl} 
                width="100%" 
                height="100%"
                frameBorder="0" 
                allowFullScreen
                allow="camera; microphone; fullscreen"
                className="w-full h-full border-none"
                title={`${currentAgent.title} Avatar`}
              />

              {/* Fullscreen Toggle */}
              {!isFullscreen && (
                <div className="absolute top-4 right-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="bg-black/50 text-white border-0 hover:bg-black/70"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Exit Fullscreen */}
              {isFullscreen && (
                <div className="absolute top-4 right-4 z-50">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="bg-black/50 text-white border-0 hover:bg-black/70"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Status Indicator */}
              <div className="absolute top-4 left-4 z-40">
                <div className="flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live Avatar
                </div>
              </div>
            </div>
          </Card>

          {/* Instructions Overlay (only when not fullscreen) */}
          {!isFullscreen && (
            <div className="mt-6">
              <Card className="p-6 bg-background/95 backdrop-blur">
                <h3 className="text-lg font-medium mb-4 text-center">How to Use Your Avatar</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-sage font-medium">1</span>
                    </div>
                    <p>Allow camera and microphone permissions when prompted</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-sage font-medium">2</span>
                    </div>
                    <p>Speak naturally - your avatar will respond in real-time</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-sage font-medium">3</span>
                    </div>
                    <p>Use fullscreen for immersive conversation experience</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Avatar;
