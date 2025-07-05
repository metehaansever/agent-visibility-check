
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import RadarChart from "./RadarChart";

interface VisibilityAnalysis {
  brandMentioned: boolean;
  llmContextMatch: number;
  mentionVisibility: number;
  sourceBreakdown: {
    blog: number;
    wiki: number;
    social: number;
  };
  socialSignals: number;
  summary: string;
}

const PromptChecker = () => {
  const [prompt, setPrompt] = useState("");
  const [brand, setBrand] = useState("");
  const [result, setResult] = useState<VisibilityAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!prompt || !brand) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-prompt', {
        body: { prompt, brand }
      });

      if (error) throw error;
      setResult(data.analysis);
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      setResult({
        brandMentioned: false,
        llmContextMatch: 0,
        mentionVisibility: 0,
        sourceBreakdown: { blog: 0, wiki: 0, social: 0 },
        socialSignals: 0,
        summary: 'Error analyzing prompt. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., What are the best project management tools?"
            className="w-full p-3 border-2 border-black focus:outline-none focus:bg-gray-50"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Your Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g., Notion, Slack, Asana"
            className="w-full p-3 border-2 border-black focus:outline-none focus:bg-gray-50"
          />
        </div>
      </div>
      
      <button
        onClick={handleAnalyze}
        disabled={!prompt || !brand || isLoading}
        className="bg-black text-white px-6 py-3 border-2 border-black hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Analyzing..." : "Analyze Visibility"}
      </button>

      {result && (
        <div className="space-y-6">
          <div className="border-2 border-black p-4 bg-gray-50">
            <h4 className="text-sm font-semibold mb-4">Visibility Insight Dashboard</h4>
            
            <RadarChart
              data={{
                schemaUsage: undefined,
                readability: undefined,
                socialSignals: result.socialSignals,
                llmContextMatch: result.llmContextMatch,
                mentionVisibility: result.mentionVisibility
              }}
              title="Brand Visibility Analysis"
            />

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Brand Mentioned:</span>
                  <span className={`ml-2 ${result.brandMentioned ? 'text-green-600' : 'text-red-600'}`}>
                    {result.brandMentioned ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Context Match:</span>
                  <span className="ml-2">{result.llmContextMatch}%</span>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium block mb-2">Source Type Breakdown:</span>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Blog: {result.sourceBreakdown.blog}%</div>
                  <div>Wiki: {result.sourceBreakdown.wiki}%</div>
                  <div>Social: {result.sourceBreakdown.social}%</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white border border-gray-300">
                <span className="text-sm font-medium">Summary:</span>
                <p className="text-sm mt-1">{result.summary}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptChecker;
