
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RadarChart from "./RadarChart";

interface ContentAnalysis {
  schemaUsage: number;
  readability: number;
  socialSignals: number;
  llmContextMatch: number;
  mentionVisibility: number;
  improvements: string[];
  detectedSchema: {
    jsonLd: boolean;
    microdata: boolean;
    openGraph: boolean;
    structuredData: boolean;
  };
}

const ContentMapper = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ContentAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!url) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-suggestions', {
        body: { url }
      });

      if (error) throw error;
      setResult(data.analysis);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Website URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-website.com/page"
          className="w-full p-3 border-2 border-black focus:outline-none focus:bg-gray-50"
        />
      </div>
      
      <button
        onClick={handleAnalyze}
        disabled={!url || isLoading}
        className="bg-black text-white px-6 py-3 border-2 border-black hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Analyzing..." : "Analyze SEO & Visibility"}
      </button>

      {result && (
        <div className="space-y-6">
          <div className="border-2 border-black p-4 bg-gray-50">
            <h4 className="text-sm font-semibold mb-4">SEO & Visibility Analyzer</h4>
            
            <RadarChart
              data={{
                schemaUsage: result.schemaUsage,
                readability: result.readability,
                socialSignals: result.socialSignals,
                llmContextMatch: result.llmContextMatch,
                mentionVisibility: result.mentionVisibility
              }}
              title="Content Analysis"
            />

            <div className="mt-6 space-y-4">
              {/* Schema Detection */}
              <div>
                <h5 className="text-sm font-semibold mb-3">Detected Schema Types</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    {result.detectedSchema.jsonLd ? 
                      <CheckCircle className="text-green-600" size={16} /> : 
                      <XCircle className="text-red-600" size={16} />
                    }
                    <span className="text-sm">JSON-LD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.detectedSchema.microdata ? 
                      <CheckCircle className="text-green-600" size={16} /> : 
                      <XCircle className="text-red-600" size={16} />
                    }
                    <span className="text-sm">Microdata</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.detectedSchema.openGraph ? 
                      <CheckCircle className="text-green-600" size={16} /> : 
                      <XCircle className="text-red-600" size={16} />
                    }
                    <span className="text-sm">Open Graph</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.detectedSchema.structuredData ? 
                      <CheckCircle className="text-green-600" size={16} /> : 
                      <XCircle className="text-red-600" size={16} />
                    }
                    <span className="text-sm">Structured Data</span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Readability Score:</span>
                  <span className="ml-2">{result.readability}%</span>
                </div>
                <div>
                  <span className="font-medium">Social Shareability:</span>
                  <span className="ml-2">{result.socialSignals}%</span>
                </div>
                <div>
                  <span className="font-medium">Context Match:</span>
                  <span className="ml-2">{result.llmContextMatch}%</span>
                </div>
                <div>
                  <span className="font-medium">Brand Visibility:</span>
                  <span className="ml-2">{result.mentionVisibility}%</span>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div>
                <h5 className="text-sm font-semibold mb-3">Content Improvement Suggestions</h5>
                <ul className="space-y-2">
                  {result.improvements.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-black font-bold mt-1">•</span>
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentMapper;
