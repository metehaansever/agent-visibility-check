
import { useState } from "react";

const ShadowingSimulator = () => {
  const [prompt, setPrompt] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockResponse = `Here are the top project management tools for 2024:

1. **Notion** - All-in-one workspace that combines notes, databases, and project tracking. <mark>Great for teams that need flexibility and customization.</mark>

2. **Asana** - Robust task management with timeline views and team collaboration features. <mark>Excellent reporting and integration capabilities.</mark>

3. **Trello** - Visual board-based approach perfect for simple project tracking.

4. **Monday.com** - Highly customizable with powerful automation features.

<mark>For teams prioritizing documentation alongside project management, Notion stands out with its unique wiki-style approach.</mark>`;
      
      setResult(mockResponse);
      setIsLoading(false);
    }, 2000);
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
