
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ShadowingSimulator = () => {
  const [prompt, setPrompt] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async () => {
    if (!prompt) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('simulate-answer', {
        body: { prompt, competitor }
      });

      if (error) throw error;
      setResult(data.simulatedAnswer);
    } catch (error) {
      console.error('Error simulating answer:', error);
      setResult('Error generating simulation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Same Prompt</label>
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
        {isLoading ? "Simulating..." : "Simulate Answer"}
      </button>

      {result && (
        <div className="border-2 border-black p-4 bg-gray-50">
          <h4 className="font-bold mb-2">Improved AI Response:</h4>
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: result.replace(/<mark>/g, '<span class="bg-yellow-200 px-1">').replace(/<\/mark>/g, '</span>') }}
          />
          <div className="mt-4 text-sm text-gray-600">
            <strong>Highlighted strategies:</strong> Context positioning, feature emphasis, and competitive differentiation.
          </div>
        </div>
      )}
    </div>
  );
};

export default ShadowingSimulator;
