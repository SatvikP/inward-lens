import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { SpeechRecognition, TextToSpeech } from "@/lib/speechService";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const speechRecognition = useRef<SpeechRecognition | null>(null);
  const textToSpeech = useRef<TextToSpeech | null>(null);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      // Add welcome message
      const welcomeMessage = {
        id: "welcome",
        role: "assistant" as const,
        content: "Hello. I'm your aspirational self - here to listen and help you explore what's on your mind. What would you like to reflect on today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      // Speak welcome message if speech is enabled
      if (speechEnabled && textToSpeech.current) {
        setTimeout(() => {
          textToSpeech.current?.speak(welcomeMessage.content);
        }, 1000);
      }
    };

    checkAuth();

    // Initialize speech services
    textToSpeech.current = new TextToSpeech();
    speechRecognition.current = new SpeechRecognition(
      (transcript) => {
        setCurrentMessage(transcript);
        setIsListening(false);
      },
      (error) => {
        toast({
          title: "Speech Recognition Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
        setIsListening(false);
      }
    );

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, speechEnabled, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "Take care of yourself.",
    });
  };

  const toggleListening = () => {
    if (isListening) {
      speechRecognition.current?.stop();
      setIsListening(false);
    } else {
      speechRecognition.current?.start();
      setIsListening(true);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      textToSpeech.current?.stop();
      setIsSpeaking(false);
    }
    setSpeechEnabled(!speechEnabled);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setLoading(true);

    try {
      // Call the AI function
      const { data, error } = await supabase.functions.invoke('ai', {
        body: { 
          message: userMessage.content,
          useOpenAI: true // Try OpenAI first
        }
      });

      if (error) throw error;

      const avatarMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, avatarMessage]);
      
      // Speak the response if speech is enabled
      if (speechEnabled) {
        setIsSpeaking(true);
        try {
          await textToSpeech.current?.speak(data.response);
        } catch (speechError) {
          console.error('Text-to-speech error:', speechError);
        } finally {
          setIsSpeaking(false);
        }
      }

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <div>
            <h1 className="text-xl font-light text-sage">Look Inwards</h1>
            <p className="text-sm text-muted-foreground">
              Conversing with Your Aspirational Self
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSpeech}
              className={speechEnabled ? "text-sage" : "text-muted-foreground"}
            >
              {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="h-[calc(100vh-200px)] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-6 mb-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card className={`max-w-md p-6 ${
                  message.role === "user" 
                    ? "bg-sage text-white" 
                    : "bg-background/95 backdrop-blur shadow-lg"
                }`}>
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-sage-light rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-sage rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-sage">Your Aspirational Self</span>
                        {isSpeaking && <span className="text-xs text-sage/60 block">Speaking...</span>}
                      </div>
                    </div>
                  )}
                  <p className="text-base leading-relaxed">{message.content}</p>
                  <div className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </Card>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <Card className="max-w-md p-6 bg-background/95 backdrop-blur shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-sage-light rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-sage rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-sage">Your Aspirational Self</span>
                      {loading && <span className="text-xs text-sage/60 block">Thinking...</span>}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-sage rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-sage rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-sage rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleListening}
              disabled={loading}
              className={`h-12 px-3 ${isListening ? "bg-red-50 border-red-200 text-red-600" : ""}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder={isListening ? "Listening..." : "Share what's on your mind or click the mic..."}
              className="flex-1 h-12 text-base bg-background/95 backdrop-blur border-sage/20 focus:border-sage"
              disabled={loading || isListening}
            />
            <Button
              type="submit"
              disabled={loading || !currentMessage.trim() || isListening}
              className="h-12 px-8"
            >
              {loading ? "..." : "Send"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Chat;