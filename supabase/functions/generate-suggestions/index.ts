
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

    // Fetch the webpage content
    let pageContent = '';
    try {
      const pageResponse = await fetch(url);
      pageContent = await pageResponse.text();
    } catch (fetchError) {
      console.log('Could not fetch page content, using URL analysis only');
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
            content: `You are an SEO and content visibility expert. Analyze webpage content for AI visibility optimization. Return ONLY a valid JSON object with exactly these fields:
            - schemaUsage: number (0-100, schema markup quality)
            - readability: number (0-100, content readability score)
            - socialSignals: number (0-100, shareability potential)
            - llmContextMatch: number (0-100, topic coherence)
            - mentionVisibility: number (0-100, brand prominence)
            - improvements: array of 2-3 specific suggestions
            - detectedSchema: object with jsonLd, microdata, openGraph, structuredData booleans
            
            Return ONLY the JSON object, no other text. Make sure all values are valid numbers between 0-100 and all fields are present.`
          },
          {
            role: 'user',
            content: `Analyze this URL and content for SEO and AI visibility: ${url}${pageContent ? `\n\nPage content: ${pageContent.substring(0, 2000)}` : ''}. Return ONLY valid JSON. `
          }
        ],
        max_tokens: 600,
        temperature: 0.3,
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
      const requiredFields = ['schemaUsage', 'readability', 'socialSignals', 'llmContextMatch', 'mentionVisibility', 'improvements', 'detectedSchema'];
      const missingFields = requiredFields.filter(field => !(field in analysis));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
    } catch (error) {
      console.error('Error parsing or validating analysis:', error);
      throw new Error('Failed to parse analysis data. Please try again.');
    }

    return new Response(JSON.stringify({ analysis }), {
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
