import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

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
    const { brand, platforms } = await req.json();
    console.log('Received request:', { brand, platforms });

    if (!brand || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      console.error('Invalid input');
      return new Response(JSON.stringify({
        brand: null,
        platforms: null,
        analysis: {
          trends: [],
          insights: ["Please provide a brand name and at least one platform"]
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Create a prompt that focuses on finding real data
    const prompt = `You are a professional trend analyst. Your task is to research recent trends for ${brand} on ${platforms.join(', ')}. 
    
    1. Use your web search capabilities to find real data from social media analytics, news articles, and brand reports.
    2. For each trend, provide actual engagement numbers and verified sources.
    3. Focus on recent (last 30 days) trends and data.
    4. Only include trends that have actual data points available.
    5. If no verifiable data is found, return an empty trends array.
    
    Return a JSON object with this structure:
    {
      "trends": [
        {
          "summary": "string",
          "engagement": {
            "mentions": number,
            "likes": number,
            "shares": number,
            "comments": number
          },
          "sentiment": "string",
          "influencers": [
            {
              "username": "string",
              "platform": "string",
              "followers": number,
              "engagement_rate": number,
              "content": "string"
            }
          ],
          "platform_distribution": {
            "twitter": number,
            "instagram": number,
            "tiktok": number,
            "reddit": number,
            "youtube": number
          },
          "timestamp": "string",
          "sources": ["string"]
        }
      ],
      "insights": ["string"]
    }`;

    console.log('Using prompt:', prompt);

    // Call OpenAI API with research mode enabled
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',  // Changed from gpt-4o-mini
        messages: [
          {
            role: 'system',
            content: 'You are a professional trend analyst. Use your research capabilities to find real data across all platforms. Verify information using multiple sources and cross-reference data points. Return ONLY a properly formatted JSON object with the exact structure requested. Include sources for all data points.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
        tools: [
          {
            type: "function",
            function: {
              name: "search_web",
              description: "Search the web for information",
              parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] }
            }
          }
        ],
        tool_choice: "auto"
      }),
    });

    console.log('OpenAI API response status:', response.status);
    console.log('OpenAI API response headers:', response.headers);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return new Response(JSON.stringify({
        brand: null,
        platforms: null,
        analysis: {
          trends: [],
          insights: [errorData.error?.message || 'OpenAI API error']
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    const data = await response.json();
    console.log('Raw OpenAI response:', JSON.stringify(data, null, 2));

    let content = data.choices[0].message.content;
    console.log('Raw content:', content);

    // Clean up the response if it contains extra text
    const match = content.match(/\{.*\}/s);
    if (match) {
      content = match[0];
      console.log('Cleaned content:', content);
    } else {
      console.log('No JSON object found in response');
    }

    try {
      const analysis = JSON.parse(content);
      console.log('Parsed analysis:', JSON.stringify(analysis, null, 2));

      // Validate the analysis structure
      if (!analysis.trends || !Array.isArray(analysis.trends)) {
        console.error('Invalid analysis structure:', analysis);
        return new Response(JSON.stringify({
          brand: null,
          platforms: null,
          analysis: {
            trends: [],
            insights: ["Invalid response structure from AI"]
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      }

      // Ensure we have at least one trend
      if (!analysis.trends || analysis.trends.length === 0) {
        analysis.trends = [{
          summary: "No significant trends found with verifiable data",
          engagement: {
            mentions: 0,
            likes: 0,
            shares: 0,
            comments: 0
          },
          sentiment: "neutral",
          influencers: [],
          platform_distribution: {
            twitter: 0,
            instagram: 0,
            tiktok: 0,
            reddit: 0,
            youtube: 0
          },
          timestamp: new Date().toISOString(),
          sources: []
        }];
        analysis.insights = ["No verifiable trends were detected at this time.",
                           "Try checking again later as trends may develop."];
      }

      // Add sources information to the response
      analysis.trends.forEach(trend => {
        trend.sources = Array.isArray(trend.sources) ? trend.sources : [];
      });

      return new Response(JSON.stringify({
        brand,
        platforms,
        analysis
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });

    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      console.log('Content that failed to parse:', content);
      return new Response(JSON.stringify({
        brand: null,
        platforms: null,
        analysis: {
          trends: [],
          insights: ["Error parsing AI response. Please try again."]
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      brand: null,
      platforms: null,
      analysis: {
        trends: [],
        insights: [error.message]
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  }
});