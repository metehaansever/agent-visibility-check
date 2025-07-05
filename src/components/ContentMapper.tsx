
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ContentMapper = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!url) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-suggestions', {
        body: { url }
      });

      if (error) throw error;
      setResult(data);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setResult({
        schema: { structured: false, breadcrumbs: false, faq: false, article: false },
        readability: 0,
        suggestions: ['Error generating suggestions. Please try again.']
      });
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
        {isLoading ? "Analyzing..." : "Generate Suggestions"}
      </button>

      {result && (
        <div className="space-y-6">
          {/* Schema Detection */}
          <div className="border-2 border-black p-4">
            <h4 className="font-bold mb-3">Detected Schema</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                {result.schema.structured ? 
                  <CheckCircle className="text-green-600" size={16} /> : 
                  <XCircle className="text-red-600" size={16} />
                }
                <span>Structured Data</span>
              </div>
              <div className="flex items-center gap-2">
                {result.schema.breadcrumbs ? 
                  <CheckCircle className="text-green-600" size={16} /> : 
                  <XCircle className="text-red-600" size={16} />
                }
                <span>Breadcrumbs</span>
              </div>
              <div className="flex items-center gap-2">
                {result.schema.faq ? 
                  <CheckCircle className="text-green-600" size={16} /> : 
                  <XCircle className="text-red-600" size={16} />
                }
                <span>FAQ Schema</span>
              </div>
              <div className="flex items-center gap-2">
                {result.schema.article ? 
                  <CheckCircle className="text-green-600" size={16} /> : 
                  <XCircle className="text-red-600" size={16} />
                }
                <span>Article Schema</span>
              </div>
            </div>
          </div>

          {/* Readability Score */}
          <div className="border-2 border-black p-4">
            <h4 className="font-bold mb-2">Readability Score</h4>
            <div className="text-3xl font-bold">{result.readability}%</div>
            <div className="text-sm text-gray-600 mt-1">
              {result.readability >= 70 ? "Good readability" : "Needs improvement"}
            </div>
          </div>

          {/* Suggestions */}
          <div className="border-2 border-black p-4">
            <h4 className="font-bold mb-3">Content Improvement Suggestions</h4>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-black font-bold mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentMapper;
