import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Video, ArrowLeft } from "lucide-react";

const Options = () => {
  const navigate = useNavigate();



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
              Back
            </Button>
            <div>
              <h1 className="text-xl font-light text-sage">Look Inwards</h1>
              <p className="text-sm text-muted-foreground">Choose your conversation style</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="py-12">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4 text-sage">
              Welcome
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              How would you like to connect with your aspirational self today?
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
      </main>
    </div>
  );
};

export default Options;