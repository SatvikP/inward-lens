import { HeroButton } from "@/components/ui/hero-button";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "lucide-react";
const Landing = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-warm-white to-sage-light">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-light text-sage">Look Inwards</div>
          <div className="flex gap-4">
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Welcome Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-hero mb-8">
              Look Inwards
            </h1>
            <p className="text-subtitle mb-12 max-w-3xl mx-auto">
              Talk to different versions of yourself and navigate life through thoughtful conversations.
            </p>
          </div>
        </section>

        {/* Avatar Selection Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Avatar Selection Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light mb-4 text-sage">
                Choose Your Avatar
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Select which version of yourself you'd like to connect with today.
              </p>
            </div>

            {/* Avatar Options */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Calm & Composed Avatar */}
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-sage/20" onClick={() => navigate("/avatar/calm")}>
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Video className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-medium">Calm & Composed</CardTitle>
                  <CardDescription className="text-base">
                    Talk to your serene, balanced self - focused on mindfulness, peace, and steady growth
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Mindful guidance
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Stress reduction focus
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Real-time video chat
                    </div>
                  </div>
                  <Button className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Talk to Calm You
                  </Button>
                </CardContent>
              </Card>

              {/* Driven & Disciplined Avatar */}
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-sage/20" onClick={() => navigate("/avatar/driven")}>
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                    <Video className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl font-medium">Driven & Disciplined</CardTitle>
                  <CardDescription className="text-base">
                    Connect with your ambitious, goal-oriented self - pushing you toward excellence and achievement
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Goal-oriented coaching
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Performance optimization
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Real-time video chat
                    </div>
                  </div>
                  <Button className="w-full group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    Talk to Driven You
                  </Button>
                </CardContent>
              </Card>

              {/* Confident & Charismatic Avatar */}
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-sage/20" onClick={() => navigate("/avatar/confident")}>
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <Video className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl font-medium">Confident & Charismatic</CardTitle>
                  <CardDescription className="text-base">
                    Speak with your bold, inspiring self - building confidence, social skills, and leadership
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Confidence building
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Social skills enhancement
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Real-time video chat
                    </div>
                  </div>
                  <Button className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    Talk to Confident You
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-12">
              <p className="text-sm text-muted-foreground">
                Each avatar represents a different aspect of your aspirational self - choose the one that resonates with your current needs
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="animate-slide-up">
                <div className="relative w-20 h-20 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <div className="absolute inset-0 bg-sage-light rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-2 bg-sage-light rounded-full animate-ping opacity-40" style={{ animationDelay: "0.5s" }}></div>
                  <div className="relative w-10 h-10 bg-sage rounded-full"></div>
                </div>
                <h3 className="text-2xl font-medium mb-4">Gentle Guidance</h3>
                <p className="text-lg text-muted-foreground">
                  Your avatar asks thoughtful questions to help you discover your own answers.
                </p>
              </div>
              
              <div className="animate-slide-up" style={{
              animationDelay: "0.2s"
            }}>
                <div className="relative w-20 h-20 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <div className="absolute inset-0 bg-sage-light rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-2 bg-sage-light rounded-full animate-ping opacity-40" style={{ animationDelay: "0.5s" }}></div>
                  <div className="relative w-10 h-10 bg-sage rounded-full"></div>
                </div>
                <h3 className="text-2xl font-medium mb-4">Safe Space</h3>
                <p className="text-lg text-muted-foreground">
                  A private, judgment-free environment for honest self-reflection.
                </p>
              </div>
              
              <div className="animate-slide-up" style={{
              animationDelay: "0.4s"
            }}>
                <div className="relative w-20 h-20 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <div className="absolute inset-0 bg-sage-light rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-2 bg-sage-light rounded-full animate-ping opacity-40" style={{ animationDelay: "0.5s" }}></div>
                  <div className="relative w-10 h-10 bg-sage rounded-full"></div>
                </div>
                <h3 className="text-2xl font-medium mb-4">Your Pace</h3>
                <p className="text-lg text-muted-foreground">
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
    </div>;
};
export default Landing;