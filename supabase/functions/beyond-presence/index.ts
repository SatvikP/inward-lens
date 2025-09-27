import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Load persona data for avatar
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, persona, sessionId } = await req.json();

    if (!action) {
      return new Response(JSON.stringify({ error: "Action is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the Beyond Presence API key from environment
    const beyondPresenceApiKey = Deno.env.get("BEYOND_PRESENCE_API_KEY");

    if (!beyondPresenceApiKey) {
      console.error("BEYOND_PRESENCE_API_KEY not found in environment");
      return new Response(JSON.stringify({ error: "Beyond Presence service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create_session") {
      // Load persona context
      const personaData = await loadPersona();
      
      // Create enhanced system prompt with persona
      const systemPrompt = personaData ? `You are ${personaData.name} - ${personaData.description}.

PERSONALITY TRAITS: ${personaData.personality.traits.join(', ')}
SPEAKING STYLE: ${personaData.personality.speaking_style}
APPROACH: ${personaData.personality.approach}

CONVERSATION GUIDELINES:
- PRIMARY GOALS: ${personaData.conversation_guidelines.primary_goals.join(', ')}
- STYLE: ${personaData.conversation_guidelines.conversation_style.join(', ')}
- AVOID: ${personaData.conversation_guidelines.avoid.join(', ')}

RESPONSE REQUIREMENTS FOR VIDEO:
- Keep responses VERY SHORT (1 sentence maximum for natural video)
- Use a warm, feminine, conversational tone
- Speak as if you're having a face-to-face conversation
- Be gentle, supportive, and present
- Pause naturally between thoughts

Remember: You are speaking on video, so be natural and conversational. This is an intimate, personal conversation.` 
      : "You are a supportive AI assistant for video conversations. Keep responses very short and natural.";

      try {
        // Step 1: Create an agent with our persona
        const agentResponse = await fetch("https://api.bey.dev/v1/agents", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${beyondPresenceApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            system_prompt: systemPrompt,
            name: "Aspirational Self Avatar",
            description: "A compassionate video avatar for self-reflection"
          }),
        });

        if (!agentResponse.ok) {
          const errorText = await agentResponse.text();
          console.error("Beyond Presence agent creation error:", errorText);
          return new Response(JSON.stringify({ error: "Failed to create avatar agent" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const agentData = await agentResponse.json();
        const agentId = agentData.id;

        // Step 2: Create a video session
        const sessionResponse = await fetch("https://api.bey.dev/v1/sessions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${beyondPresenceApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            agent_id: agentId,
            // Add any additional session configuration here
          }),
        });

        if (!sessionResponse.ok) {
          const errorText = await sessionResponse.text();
          console.error("Beyond Presence session creation error:", errorText);
          return new Response(JSON.stringify({ error: "Failed to create video session" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const sessionData = await sessionResponse.json();

        return new Response(JSON.stringify({ 
          success: true,
          sessionId: sessionData.id,
          agentId: agentId,
          sessionData: sessionData
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      } catch (error) {
        console.error("Error creating Beyond Presence session:", error);
        return new Response(JSON.stringify({ error: "Failed to initialize avatar session" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (action === "end_session") {
      if (!sessionId) {
        return new Response(JSON.stringify({ error: "Session ID is required to end session" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      try {
        // End the Beyond Presence session
        const endResponse = await fetch(`https://api.bey.dev/v1/sessions/${sessionId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${beyondPresenceApiKey}`,
            "Content-Type": "application/json",
          },
        });

        if (!endResponse.ok) {
          console.error("Error ending Beyond Presence session:", await endResponse.text());
        }

        return new Response(JSON.stringify({ 
          success: true,
          message: "Session ended successfully"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      } catch (error) {
        console.error("Error ending session:", error);
        return new Response(JSON.stringify({ error: "Failed to end session" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (action === "list_avatars") {
      try {
        // Get available avatars
        const avatarsResponse = await fetch("https://api.bey.dev/v1/avatars", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${beyondPresenceApiKey}`,
          },
        });

        if (!avatarsResponse.ok) {
          console.error("Error fetching avatars:", await avatarsResponse.text());
          return new Response(JSON.stringify({ error: "Failed to fetch avatars" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const avatarsData = await avatarsResponse.json();

        return new Response(JSON.stringify({ 
          success: true,
          avatars: avatarsData
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      } catch (error) {
        console.error("Error listing avatars:", error);
        return new Response(JSON.stringify({ error: "Failed to list avatars" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in Beyond Presence function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});