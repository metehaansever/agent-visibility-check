
import { useState } from "react";

const PromptChecker = () => {
  const [prompt, setPrompt] = useState("");
  const [brand, setBrand] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        "Your brand is not mentioned in typical AI responses.",
        "Visibility Score: 32% - Your brand appears in 3 out of 10 AI answers.",
        "Visibility Score: 78% - Strong presence in AI responses!",
        "Partial visibility detected - appears in context but not prominently."
      ];
      setResult(mockResults[Math.floor(Math.random() * mockResults.length)]);
      setIsLoading(false);
    }, 1500);
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
        {isLoading ? "Analyzing..." : "Analyze Prompt"}
      </button>

      {result && (
        <div className="border-2 border-black p-4 bg-gray-50">
          <h4 className="font-bold mb-2">Analysis Result:</h4>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default PromptChecker;
