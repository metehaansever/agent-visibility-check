import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, brand, iterations = 3 } = await req.json();
    console.log('Received request:', { prompt, brand, iterations });

    if (!prompt || !brand) {
      console.error('Missing required parameters');
      return new Response(JSON.stringify({ error: 'Both prompt and brand are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (iterations < 1 || iterations > 100) {
      console.error('Invalid iterations value:', iterations);
      return new Response(JSON.stringify({ error: 'Iterations must be between 1 and 100' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    let currentPrompt = prompt;
    let bestScore = -Infinity;
    let bestPrompt = prompt;
    let history: any[] = [];

    console.log(`Starting optimization with ${iterations} iterations`);

    try {
      for (let i = 0; i < iterations; i++) {
        console.log(`\nStarting iteration ${i + 1}/${iterations}`);
        console.log('Current prompt:', currentPrompt);

        const systemPrompt = `
You are a branding strategist. Improve the following marketing message for better emotional appeal, clarity, and LLM visibility. Return only valid JSON:
{
  "improvedPrompt": string,
  "score": {
    "emotionalAppeal": number (1-10),
    "clarity": number (1-10),
    "llmVisibility": number (1-10)
  },
  "reasoning": string
}`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openAIApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              {
                role: "user",
                content: `Brand: "${brand}"\nPrompt: "${currentPrompt}"`,
              }
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          console.error('OpenAI API error:', response.status, await response.text());
          throw new Error(`OpenAI API failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('OpenAI response:', data);
        
        const content = data.choices[0].message.content.trim();
        const clean = content.replace(/```json\s*|\s*```/g, "");

        try {
          const result = JSON.parse(clean);
          console.log('Parsed result:', result);

          if (!result.improvedPrompt || !result.score || !result.reasoning) {
            throw new Error('Invalid response format');
          }

          const scoreTotal =
            result.score.emotionalAppeal + result.score.clarity + result.score.llmVisibility;

          history.push({
            iteration: i + 1,
            prompt: currentPrompt,
            improvedPrompt: result.improvedPrompt,
            score: result.score,
            scoreTotal,
            reasoning: result.reasoning,
          });

          if (scoreTotal > bestScore) {
            bestScore = scoreTotal;
            bestPrompt = result.improvedPrompt;
            currentPrompt = result.improvedPrompt;
          }

          console.log(`Iteration ${i + 1} complete. Current best score: ${bestScore.toFixed(1)}`);
        } catch (parseError) {
          console.error('Failed to parse response:', parseError);
          throw new Error('Invalid response format from OpenAI');
        }
      }

      return new Response(JSON.stringify({
        finalPrompt: bestPrompt,
        history,
        bestScore,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Optimization error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Request error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
