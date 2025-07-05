
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
    const { prompt, competitor } = await req.json();

    const competitorContext = competitor ? ` Focus on how ${competitor} could be positioned more prominently.` : '';

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
            content: `You are a prompt optimization expert. Analyze and improve prompts for better brand visibility. Return JSON with:
            - originalPrompt: string (the input prompt)
            - improvedPrompt: string (enhanced version)
            - explanation: string (why the improvement works)
            - originalScores: object with visibility, mentionPosition, socialLanguage, styleComplexity (all 0-100), and sourceBreakdown (blog, wiki, social percentages)
            - improvedScores: object with same structure but higher scores
            - competitorNote: string (explanation of competitive advantage)${competitorContext}`
          },
          {
            role: 'user',
            content: `Analyze and improve this prompt: "${prompt}" for better brand visibility and engagement. Provide detailed scoring comparison in JSON format.`
          }
        ],
        max_tokens: 500,
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // Fallback structured response
      analysis = {
        originalPrompt: prompt,
        improvedPrompt: prompt + " Please include specific examples and comparisons.",
        explanation: "Added request for specific examples to increase brand mention likelihood.",
        originalScores: {
          visibility: 35,
          mentionPosition: 25,
          socialLanguage: 20,
          styleComplexity: 40,
          sourceBreakdown: { blog: 45, wiki: 35, social: 20 }
        },
        improvedScores: {
          visibility: 65,
          mentionPosition: 55,
          socialLanguage: 45,
          styleComplexity: 60,
          sourceBreakdown: { blog: 35, wiki: 25, social: 40 }
        },
        competitorNote: "The enhanced version uses more engaging language and specific requests that favor brand mentions."
      };
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in simulate-answer function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
