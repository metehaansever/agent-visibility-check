import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TrendAnalysis {
  brand: string | null;
  platforms: string[];
  analysis: {
    trends: Array<{
      summary: string;
      engagement: {
        mentions: number;
        likes: number;
        shares: number;
        comments: number;
      };
      sentiment: string;
      influencers: string[];
      platform_distribution: {
        twitter: number;
        instagram: number;
        tiktok: number;
        reddit: number;
        youtube: number;
      };
      timestamp: string;
    }>;
    insights: string[];
  };
}

const TrendAnalyzer = () => {
  const [brand, setBrand] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["Twitter"]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!brand) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('analyze-trends', {
        body: { brand, platforms }
      });

      if (supabaseError) throw supabaseError;
      if (!data) throw new Error('No data received from analysis');
        
      // Validate the data structure
      if (!data.analysis?.trends || !Array.isArray(data.analysis.trends)) {
        throw new Error('Invalid analysis data structure');
      }
        
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing trends:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const platformOptions = [
    { value: "Twitter", label: "Twitter" },
    { value: "Instagram", label: "Instagram" },
    { value: "TikTok", label: "TikTok" },
    { value: "Reddit", label: "Reddit" },
    { value: "YouTube", label: "YouTube" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Brand Name</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g., Nike, Adidas"
            className="w-full p-3 border-2 border-black focus:outline-none focus:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Platforms</label>
          <select
            multiple
            value={platforms}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              setPlatforms(selected);
            }}
            className="w-full p-3 border-2 border-black focus:outline-none focus:bg-gray-50"
          >
            {platformOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <button
        onClick={handleAnalyze}
        disabled={!brand || loading}
        className="bg-black text-white px-6 py-3 border-2 border-black hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            Analyzing...
          </>
        ) : (
          "Analyze Trends"
        )}
      </button>

      {error && (
        <div className="border-2 border-black p-4 bg-red-100 text-red-900">
          {error}
        </div>
      )}

      {analysis && analysis.brand && analysis.platforms && analysis.analysis && (
        <div className="space-y-6">
          <div className="border-2 border-black p-4 bg-gray-50">
            <h4 className="text-sm font-semibold mb-4">Trend Analysis Results</h4>
            
            <div className="space-y-4">
              {analysis.analysis.trends.length > 0 ? (
                analysis.analysis.trends.map((trend, index) => (
                  <div key={index} className="border-2 border-black p-4 bg-white">
                    <h5 className="text-sm font-medium mb-2">Trend {index + 1}</h5>
                    <p className="text-sm mb-2">{trend.summary}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium mb-1">Engagement</p>
                        <p className="text-sm">
                          {trend.engagement.mentions} mentions<br />
                          {trend.engagement.likes} likes<br />
                          {trend.engagement.shares} shares<br />
                          {trend.engagement.comments} comments
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-1">Sentiment</p>
                        <p className="text-sm">{trend.sentiment}</p>
                        <p className="text-xs font-medium mt-2 mb-1">Influencers</p>
                        {trend.influencers.length > 0 ? (
                          <ul className="list-disc list-inside text-sm">
                            {trend.influencers.map((influencer, i) => (
                              <li key={i}>{influencer}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm">No influencers found</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border-2 border-black p-4 bg-white">
                  <p className="text-sm">No significant trends found at this time.</p>
                  <p className="text-sm mt-2">This might mean that:</p>
                  <ul className="list-disc list-inside text-sm mt-2">
                    <li>The brand is not currently trending on the selected platforms</li>
                    <li>The selected platforms might not be relevant for this brand</li>
                    <li>Try different platforms or try again later</li>
                  </ul>
                </div>
              )}
              
              <div className="border-2 border-black p-4 bg-white">
                <h5 className="text-sm font-medium mb-2">Actionable Insights</h5>
                {analysis.analysis.insights.length > 0 ? (
                  <ul className="list-disc list-inside text-sm">
                    {analysis.analysis.insights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">No insights available at this time.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendAnalyzer;