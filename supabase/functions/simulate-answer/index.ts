
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
            content: `You are a prompt optimization expert. Analyze and improve prompts for better brand visibility. Return ONLY a valid JSON object with exactly these fields:
            - originalPrompt: string (the input prompt)
            - improvedPrompt: string (enhanced version)
            - explanation: string (why the improvement works)
            - originalScores: object with visibility, mentionPosition, socialLanguage, styleComplexity (all 0-100), and sourceBreakdown (blog, wiki, social percentages)
            - improvedScores: object with same structure but higher scores
            - competitorNote: string (explanation of competitive advantage)
            
            Return ONLY the JSON object, no other text. Make sure all values are valid numbers between 0-100 and all percentages sum to 100. All fields must be present.`
          },
          {
            role: 'user',
            content: `Analyze and improve this prompt: "${prompt}" for better brand visibility and engagement. Return ONLY valid JSON.`
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
      const requiredFields = ['originalPrompt', 'improvedPrompt', 'explanation', 'originalScores', 'improvedScores', 'competitorNote'];
      const missingFields = requiredFields.filter(field => !(field in analysis));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate score ranges
      const validateScores = (scores: any) => {
        const scoreFields = ['visibility', 'mentionPosition', 'socialLanguage', 'styleComplexity'];
        const breakdownFields = ['blog', 'wiki', 'social'];
        
        // Check score fields are numbers between 0-100
        for (const field of scoreFields) {
          if (typeof scores[field] !== 'number' || scores[field] < 0 || scores[field] > 100) {
            throw new Error(`Invalid score value for ${field}: ${scores[field]}`);
          }
        }
        
        // Check source breakdown percentages
        const breakdownSum = breakdownFields.reduce((sum, field) => sum + (scores.sourceBreakdown[field] || 0), 0);
        if (breakdownSum !== 100) {
          throw new Error('Source breakdown percentages must sum to 100');
        }
      };

      validateScores(analysis.originalScores);
      validateScores(analysis.improvedScores);
    } catch (error) {
      console.error('Error parsing or validating analysis:', error);
      throw new Error('Failed to parse analysis data. Please try again.');
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
