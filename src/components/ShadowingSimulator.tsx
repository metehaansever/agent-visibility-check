
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import RadarChart from "./RadarChart";

interface ComparisonAnalysis {
  originalPrompt: string;
  improvedPrompt: string;
  explanation: string;
  originalScores: {
    visibility: number;
    mentionPosition: number;
    socialLanguage: number;
    styleComplexity: number;
    sourceBreakdown: { blog: number; wiki: number; social: number; };
  };
  improvedScores: {
    visibility: number;
    mentionPosition: number;
    socialLanguage: number;
    styleComplexity: number;
    sourceBreakdown: { blog: number; wiki: number; social: number; };
  };
  competitorNote: string;
}

const ShadowingSimulator = () => {
  const [prompt, setPrompt] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [result, setResult] = useState<ComparisonAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async () => {
    if (!prompt) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('simulate-answer', {
        body: { prompt, competitor }
      });

      if (error) throw error;
      setResult(data.analysis);
    } catch (error) {
      console.error('Error simulating answer:', error);
      setResult(null);
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
          <label className="block text-sm font-medium mb-2">Competitor (Optional)</label>
          <input
            type="text"
            value={competitor}
            onChange={(e) => setCompetitor(e.target.value)}
            placeholder="e.g., Asana, Monday.com"
            className="w-full p-3 border-2 border-black focus:outline-none focus:bg-gray-50"
          />
        </div>
      </div>
      
      <button
        onClick={handleSimulate}
        disabled={!prompt || isLoading}
        className="bg-black text-white px-6 py-3 border-2 border-black hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Analyzing..." : "Compare Visibility"}
      </button>

      {result && (
        <div className="space-y-6">
          <div className="border-2 border-black p-4 bg-gray-50">
            <h4 className="text-sm font-semibold mb-4">Competitor Prompt Visibility Comparator</h4>
            
            <RadarChart
              data={{
                schemaUsage: undefined,
                readability: result.originalScores.styleComplexity,
                socialSignals: result.originalScores.socialLanguage,
                llmContextMatch: result.originalScores.visibility,
                mentionVisibility: result.originalScores.mentionPosition
              }}
              comparison={{
                schemaUsage: undefined,
                readability: result.improvedScores.styleComplexity,
                socialSignals: result.improvedScores.socialLanguage,
                llmContextMatch: result.improvedScores.visibility,
                mentionVisibility: result.improvedScores.mentionPosition
              }}
              title="Original"
              comparisonLabel="Enhanced"
            />

            <div className="mt-6 space-y-4">
              <div>
                <h5 className="text-sm font-semibold mb-2">Improved Prompt:</h5>
                <div className="p-3 bg-white border border-gray-300 text-sm">
                  {result.improvedPrompt}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold mb-2">Improvement Explanation:</h5>
                <p className="text-sm p-3 bg-white border border-gray-300">
                  {result.explanation}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h6 className="text-sm font-medium mb-2">Original Source Breakdown:</h6>
                  <div className="text-sm space-y-1">
                    <div>Blog: {result.originalScores.sourceBreakdown.blog}%</div>
                    <div>Wiki: {result.originalScores.sourceBreakdown.wiki}%</div>
                    <div>Social: {result.originalScores.sourceBreakdown.social}%</div>
                  </div>
                </div>
                <div>
                  <h6 className="text-sm font-medium mb-2">Enhanced Source Breakdown:</h6>
                  <div className="text-sm space-y-1">
                    <div>Blog: {result.improvedScores.sourceBreakdown.blog}%</div>
                    <div>Wiki: {result.improvedScores.sourceBreakdown.wiki}%</div>
                    <div>Social: {result.improvedScores.sourceBreakdown.social}%</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white border border-gray-300">
                <p className="text-sm italic">{result.competitorNote}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShadowingSimulator;
