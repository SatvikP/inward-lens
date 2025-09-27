import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff, ArrowLeft } from "lucide-react";

interface AvatarSession {
  id: string;
  agentId: string;
  status: 'idle' | 'connecting' | 'connected' | 'error';
}

const Avatar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AvatarSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const startAvatarSession = async () => {
    try {
      setSession({ id: '', agentId: '', status: 'connecting' });
      
      // Call our backend to create Beyond Presence session
      const { data, error } = await supabase.functions.invoke('beyond-presence', {
        body: { 
          action: 'create_session',
          persona: 'aspirational-self'
        }
      });

      if (error) throw error;

      toast({
        title: "Connecting to your avatar...",
        description: "Setting up video session",
      });

      // For now, simulate connection
      setTimeout(() => {
        setSession({ 
          id: data?.sessionId || 'demo-session', 
          agentId: data?.agentId || 'demo-agent',
          status: 'connected' 
        });
        setIsConnected(true);
        toast({
          title: "Connected!",
          description: "Your avatar is ready to talk",
        });
      }, 2000);

    } catch (error: any) {
      console.error('Error starting avatar session:', error);
      setSession({ id: '', agentId: '', status: 'error' });
      toast({
        title: "Connection Failed",
        description: "Unable to start avatar session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const endAvatarSession = async () => {
    try {
      if (session?.id) {
        await supabase.functions.invoke('beyond-presence', {
          body: { 
            action: 'end_session',
            sessionId: session.id
          }
        });
      }
    } catch (error) {
      console.error('Error ending session:', error);
    } finally {
      setSession(null);
      setIsConnected(false);
      toast({
        title: "Session Ended",
        description: "Your avatar conversation has ended",
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone On" : "Microphone Muted",
      description: isMuted ? "You can now speak" : "Your microphone is muted",
    });
  };

  const toggleVideo = () => {
    setIsVideoMuted(!isVideoMuted);
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
              onClick={() => navigate("/options")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Options
            </Button>
            <div>
              <h1 className="text-xl font-light text-sage">Video Avatar</h1>
              <p className="text-sm text-muted-foreground">
                {isConnected ? "Connected - Speak naturally" : "Real-time conversation with your aspirational self"}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          
          {/* Video Container */}
          <div className="lg:col-span-2">
            <Card className="h-full p-6 bg-black/5 border-sage/20">
              <div className="relative h-full bg-gradient-to-br from-sage/10 to-sage/20 rounded-lg overflow-hidden">
                {!isConnected ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="w-16 h-16 bg-sage rounded-full animate-pulse"></div>
                      </div>
                      <h3 className="text-xl font-medium mb-2 text-sage">Your Aspirational Self</h3>
                      <p className="text-muted-foreground mb-6">Ready to connect when you are</p>
                      <Button 
                        onClick={startAvatarSession}
                        disabled={session?.status === 'connecting'}
                        className="bg-sage hover:bg-sage/90"
                      >
                        {session?.status === 'connecting' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Phone className="h-4 w-4 mr-2" />
                            Start Video Call
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Placeholder for actual video stream */}
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      style={{ display: isVideoMuted ? 'none' : 'block' }}
                    />
                    
                    {/* Avatar placeholder when video is muted or loading */}
                    {(isVideoMuted || !videoRef.current?.srcObject) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sage/20 to-sage/30">
                        <div className="text-center">
                          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="w-16 h-16 bg-sage rounded-full animate-pulse"></div>
                          </div>
                          <p className="text-white/80">Listening...</p>
                        </div>
                      </div>
                    )}

                    {/* Connection status indicator */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Connected
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Controls</h3>
              
              {isConnected ? (
                <div className="space-y-4">
                  {/* Microphone Control */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Microphone</span>
                    <Button
                      variant={isMuted ? "destructive" : "outline"}
                      size="sm"
                      onClick={toggleMute}
                    >
                      {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Video Control */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Video</span>
                    <Button
                      variant={isVideoMuted ? "destructive" : "outline"}
                      size="sm"
                      onClick={toggleVideo}
                    >
                      {isVideoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* End Call */}
                  <Button 
                    onClick={endAvatarSession}
                    variant="destructive"
                    className="w-full mt-6"
                  >
                    <PhoneOff className="h-4 w-4 mr-2" />
                    End Call
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">Start a video call to access controls</p>
                </div>
              )}
            </Card>

            {/* Session Info */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Session Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={isConnected ? "text-green-600" : "text-muted-foreground"}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode:</span>
                  <span>Voice Only</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avatar:</span>
                  <span>Aspirational Self</span>
                </div>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">How to Use</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Click "Start Video Call" to begin</p>
                <p>• Speak naturally - no need to click anything</p>
                <p>• Your avatar will respond in real-time</p>
                <p>• Use controls to mute or end the session</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Avatar;