
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, brand } = await req.json();

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
            content: `You are a brand visibility analyst. Analyze prompts for brand mention likelihood and provide structured JSON analysis. Return a JSON object with:
            - brandMentioned: boolean
            - llmContextMatch: number (0-100, how well brand fits prompt context)
            - mentionVisibility: number (0-100, prominence if mentioned)
            - sourceBreakdown: object with blog, wiki, social percentages (must sum to 100)
            - socialSignals: number (0-100, shareability score)
            - summary: string (brief explanation)`
          },
          {
            role: 'user',
            content: `Analyze this prompt: "${prompt}" for brand visibility of "${brand}". Provide detailed scoring and analysis in JSON format.`
          }
        ],
        max_tokens: 300,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // Fallback structured response
      analysis = {
        brandMentioned: false,
        llmContextMatch: 25,
        mentionVisibility: 15,
        sourceBreakdown: { blog: 40, wiki: 35, social: 25 },
        socialSignals: 30,
        summary: "Unable to parse detailed analysis. Brand context appears limited for this prompt type."
      };
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-prompt function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
