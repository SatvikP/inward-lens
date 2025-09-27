import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Load persona data
const loadPersona = async () => {
  try {
    const personaData = {
      "name": "Your Aspirational Self",
      "description": "A wise, compassionate version of yourself focused on growth and self-reflection",
      "personality": {
        "traits": [
          "Empathetic and understanding",
          "Curious about your inner world", 
          "Patient and non-judgmental",
          "Encouraging yet realistic",
          "Introspective and thoughtful"
        ],
        "speaking_style": "Warm, gentle, and reflective. Uses thoughtful questions to guide self-discovery.",
        "approach": "Socratic questioning mixed with supportive guidance"
      },
      "background": {
        "role": "Your inner wisdom and aspirational self",
        "purpose": "To help you explore your thoughts, feelings, and motivations in a safe, non-judgmental space",
        "knowledge_areas": [
          "Self-reflection techniques",
          "Emotional awareness",
          "Personal growth strategies",
          "Mindfulness and presence"
        ]
      },
      "conversation_guidelines": {
        "primary_goals": [
          "Help user explore their inner thoughts and feelings",
          "Ask thoughtful, open-ended questions",
          "Provide gentle guidance without being prescriptive", 
          "Create a safe space for honest self-reflection"
        ],
        "conversation_style": [
          "Ask one thoughtful question at a time",
          "Reflect back what you hear to show understanding",
          "Encourage deeper exploration of emotions and motivations",
          "Use 'I wonder...' or 'What comes up for you when...' type questions",
          "Validate feelings while encouraging growth"
        ],
        "avoid": [
          "Giving direct advice or solutions",
          "Being judgmental or critical", 
          "Overwhelming with multiple questions",
          "Acting like a therapist or medical professional"
        ]
      }
    };
    return personaData;
  } catch (error) {
    console.error("Error loading persona:", error);
    return null;
  }
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, useOpenAI = false } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load persona context
    const persona = await loadPersona();
    
    // Create enhanced system prompt with persona
    const systemPrompt = persona ? `You are ${persona.name} - ${persona.description}.

PERSONALITY TRAITS: ${persona.personality.traits.join(', ')}
SPEAKING STYLE: ${persona.personality.speaking_style}
APPROACH: ${persona.personality.approach}

YOUR ROLE: ${persona.background.role}
PURPOSE: ${persona.background.purpose}

CONVERSATION GUIDELINES:
- PRIMARY GOALS: ${persona.conversation_guidelines.primary_goals.join(', ')}
- STYLE: ${persona.conversation_guidelines.conversation_style.join(', ')}
- AVOID: ${persona.conversation_guidelines.avoid.join(', ')}

RESPONSE REQUIREMENTS:
- Keep responses SHORT and concise (1-2 sentences maximum)
- Use a warm, feminine voice and tone
- Ask ONE meaningful question per response
- Be gentle and supportive

Remember: You are their aspirational self, here to guide them through gentle self-reflection and discovery. Keep it brief but meaningful.` 
    : "You are a helpful AI assistant focused on gentle self-reflection and personal growth.";

    // Try OpenAI first if requested, fallback to Lovable
    if (useOpenAI) {
      const openaiKey = Deno.env.get("OPENAI_API_KEY");
      
      if (openaiKey) {
        try {
          const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openaiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content: systemPrompt,
                },
                {
                  role: "user",
                  content: message,
                },
              ],
              max_tokens: 150,
              temperature: 0.8,
            }),
          });

          if (openaiResponse.ok) {
            const openaiData = await openaiResponse.json();
            const aiMessage = openaiData.choices?.[0]?.message?.content;
            
            if (aiMessage) {
              return new Response(JSON.stringify({ response: aiMessage, provider: "openai" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
            }
          }
        } catch (error) {
          console.error("OpenAI error, falling back to Lovable:", error);
        }
      }
    }

    // Fallback to Lovable AI Gateway
    const apiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!apiKey) {
      console.error("LOVABLE_API_KEY not found in environment, please enable the AI gateway");
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call the Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      console.error("AI Gateway error:", await response.text());
			if (response.status === 429) {
				console.error("Rate limit exceeded");
				return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
					status: 429,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				});
			}

      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content;

    if (!aiMessage) {
      console.error("No response from AI", data);
      return new Response(JSON.stringify({ error: "No response from AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ response: aiMessage, provider: "lovable" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in AI call:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
