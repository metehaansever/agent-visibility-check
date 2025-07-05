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
    const { competitorPrompt, targetBrand } = await req.json();

    const optimizeRes = await fetch("https://wrtzugagaaxcqceozcrn.supabase.co/functions/v1/optimize-prompts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: competitorPrompt,
        brand: targetBrand,
        iterations: 3,
      }),
    });
    
    const optimized = await optimizeRes.json();
    const finalPrompt = optimized.finalPrompt || competitorPrompt;

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
            content: `You are a branding strategist and competitive copywriter. Analyze competitor marketing messages and generate superior alternatives. You MUST return a valid JSON object with exactly these fields:
            - competitorAnalysis: object with valueProposition, emotionalAppeal, conversionGoal (all strings)
            - counterPrompt: string (your generated superior alternative for the target brand)
            - strategySummary: string (why your prompt is more effective)
            
            Return ONLY the JSON object, no other text.`
          },
          {
            role: 'user',
            content: `Analyze this competitor's marketing message: "${finalPrompt}" and generate a strategically superior alternative for "${targetBrand}". Return only valid JSON.`
          }
        ],
        max_tokens: 500,
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);
    
    let analysis;
    
    try {
      const content = data.choices[0].message.content.trim();
      console.log('Raw content:', content);
      
      // Remove any potential markdown formatting
      const cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();
      analysis = JSON.parse(cleanContent);
      
      // Validate required fields
      if (!analysis.competitorAnalysis || !analysis.counterPrompt || !analysis.strategySummary) {
        throw new Error('Missing required fields in analysis');
      }
      
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Provide structured fallback
      analysis = {
        competitorAnalysis: {
          valueProposition: "Cost-effective solution with competitive pricing",
          emotionalAppeal: "Security and reliability focused messaging",
          conversionGoal: "Drive immediate sign-up or trial conversion"
        },
        counterPrompt: `Experience the difference with ${targetBrand} - where innovation meets simplicity. Join thousands who've already made the switch to smarter, more intuitive solutions. Try ${targetBrand} free for 30 days and see why industry leaders choose us.`,
        strategySummary: "This counter-strategy emphasizes innovation and social proof while maintaining urgency, differentiating from price-focused competitors."
      };
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ad-duel-analyzer function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});