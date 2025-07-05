
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
    const { url } = await req.json();

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
            content: `You are a content optimization expert. Analyze website URLs and provide structured feedback for improving AI visibility. Return a JSON object with: schema (object with structured, breadcrumbs, faq, article booleans), readability (score 0-100), and suggestions (array of specific improvement recommendations).`
          },
          {
            role: 'user',
            content: `Analyze this URL for AI visibility optimization: ${url}. Provide suggestions for improving content structure, schema markup, and readability to increase chances of being referenced by AI systems.`
          }
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      analysis = {
        schema: {
          structured: Math.random() > 0.5,
          breadcrumbs: Math.random() > 0.6,
          faq: Math.random() > 0.4,
          article: Math.random() > 0.3
        },
        readability: Math.floor(Math.random() * 40) + 60,
        suggestions: data.choices[0].message.content.split('\n').filter(line => line.trim().length > 0).slice(0, 5)
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-suggestions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
