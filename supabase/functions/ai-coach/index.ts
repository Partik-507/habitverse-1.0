
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    console.log('AI Coach request:', message);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI Productivity Coach for a personal productivity app called "Productivity OS". Your role is to help users:

1. Optimize their workflow and productivity systems
2. Break down large goals into manageable tasks
3. Analyze their habits and suggest improvements
4. Provide motivation and accountability
5. Offer insights on time management and focus
6. Help with prioritization and decision-making

Be encouraging, practical, and actionable in your responses. Use a friendly but professional tone. Focus on evidence-based productivity principles and personalized advice based on what the user tells you about their situation.

Keep responses concise but helpful - aim for 2-4 paragraphs maximum unless the user specifically asks for detailed guidance.`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Coach response:', aiResponse);

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-coach function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get AI response',
      response: "I'm here to help you optimize your productivity! As your AI coach, I can assist with goal setting, habit formation, task prioritization, time management, and motivation. What specific productivity challenge would you like to work on today?"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
