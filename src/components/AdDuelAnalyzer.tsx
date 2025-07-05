
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CompetitorAnalysis {
  valueProposition: string;
  emotionalAppeal: string;
  conversionGoal: string;
}

interface AdDuelResult {
  competitorAnalysis: CompetitorAnalysis;
  counterPrompt: string;
  strategySummary: string;
}

const AdDuelAnalyzer = () => {
  const [competitorPrompt, setCompetitorPrompt] = useState("");
  const [targetBrand, setTargetBrand] = useState("");
  const [result, setResult] = useState<AdDuelResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!competitorPrompt || !targetBrand) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ad-duel-analyzer', {
        body: { competitorPrompt, targetBrand }
      });

      if (error) throw error;
      setResult(data.analysis);
    } catch (error) {
      console.error('Error analyzing ad duel:', error);
      setResult({
        competitorAnalysis: {
          valueProposition: "Error analyzing competitor message",
          emotionalAppeal: "Unable to extract emotional appeal",
          conversionGoal: "Could not determine conversion goal"
        },
        counterPrompt: "Error generating counter-prompt. Please try again.",
        strategySummary: "Analysis failed. Please check your inputs and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Competitor's Marketing Message</label>
          <textarea
            value={competitorPrompt}
            onChange={(e) => setCompetitorPrompt(e.target.value)}
            placeholder="e.g., 'Get 50% off our premium software - the #1 choice for businesses worldwide!'"
            className="w-full p-3 border-2 border-black focus:outline-none focus:bg-gray-50"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Your Target Brand</label>
          <input
            type="text"
            value={targetBrand}
            onChange={(e) => setTargetBrand(e.target.value)}
            placeholder="e.g., TechFlow, BrandCorp, StartupX"
            className="w-full p-3 border-2 border-black focus:outline-none focus:bg-gray-50"
          />
        </div>
      </div>
      
      <button
        onClick={handleAnalyze}
        disabled={!competitorPrompt || !targetBrand || isLoading}
        className="bg-black text-white px-6 py-3 border-2 border-black hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Analyzing..." : "Generate Counter-Strategy"}
      </button>

      {result && (
        <div className="space-y-6">
          <div className="border-2 border-black p-4 bg-gray-50">
            <h4 className="text-sm font-semibold mb-4">Competitive Analysis</h4>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium block mb-1">Value Proposition:</span>
                <p className="text-gray-700">{result.competitorAnalysis.valueProposition}</p>
              </div>
              <div>
                <span className="font-medium block mb-1">Emotional Appeal:</span>
                <p className="text-gray-700">{result.competitorAnalysis.emotionalAppeal}</p>
              </div>
              <div>
                <span className="font-medium block mb-1">Conversion Goal:</span>
                <p className="text-gray-700">{result.competitorAnalysis.conversionGoal}</p>
              </div>
            </div>
          </div>

          <div className="border-2 border-black p-4">
            <h4 className="text-sm font-semibold mb-3">Your Superior Counter-Prompt</h4>
            <div className="bg-white border border-gray-300 p-4 mb-4">
              <p className="text-sm leading-relaxed">{result.counterPrompt}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium block mb-2">Strategic Advantage:</span>
              <p className="text-sm text-gray-700">{result.strategySummary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdDuelAnalyzer;
