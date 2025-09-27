import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

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
  const navigate = useNavigate();
  const { toast } = useToast();

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
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: "Hello. I'm here to listen and help you explore what's on your mind. What would you like to reflect on today?",
        timestamp: new Date()
      }]);
    };

    checkAuth();

    // Listen for auth changes
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

    // Simulate avatar response (will be replaced with AI integration later)
    setTimeout(() => {
      const responses = [
        "That's interesting. What feelings come up when you think about that?",
        "I hear you. Can you tell me more about what that means to you?",
        "Thank you for sharing that with me. What do you think might be underneath that feeling?",
        "How does that sit with you right now as you say it out loud?",
        "What would it look like if you approached that differently?",
        "I'm curious - what would you tell a friend who came to you with this same concern?",
        "What part of this feels most important to explore right now?",
        "If you could ask that feeling what it needs, what do you think it might say?",
      ];

      const avatarMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, avatarMessage]);
      setLoading(false);
    }, 1500);
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
            <p className="text-sm text-muted-foreground">Your safe space for reflection</p>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
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
                        <div className="w-4 h-4 bg-sage rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-sage">Your Guide</span>
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
                      <div className="w-4 h-4 bg-sage rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-sage">Your Guide</span>
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
          <form onSubmit={sendMessage} className="flex gap-4">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Share what's on your mind..."
              className="flex-1 h-12 text-base bg-background/95 backdrop-blur border-sage/20 focus:border-sage"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !currentMessage.trim()}
              className="h-12 px-8"
            >
              Send
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Chat;