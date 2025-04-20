import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import OptimizationOptions from "@/components/OptimizationOptions";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { addToHistory } from "@/lib/storage";

// Material icons via Google Fonts CDN
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => {
  return <span className={`material-icons ${className}`}>{name}</span>;
};

interface GeneralTabProps {
  onCopy: (text: string) => void;
  showToast: (message: string, type?: "success" | "error") => void;
}

export default function GeneralTab({ onCopy, showToast }: GeneralTabProps) {
  const [inputText, setInputText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [optimizedText, setOptimizedText] = useState("");
  const [showResult, setShowResult] = useState(false);

  const optimizeMutation = useMutation({
    mutationFn: async (data: { text: string; type: string; style?: string }) => {
      const response = await apiRequest("POST", "/api/optimize", data);
      return response.json();
    },
    onSuccess: (data) => {
      setOptimizedText(data.optimizedText);
      setShowResult(true);
      // Add to history
      addToHistory({
        id: Date.now().toString(),
        type: "general",
        originalText: inputText,
        optimizedText: data.optimizedText,
        timestamp: new Date().toISOString(),
        style: selectedStyle || undefined
      });
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
    },
    onError: (error) => {
      showToast(`Optimization failed: ${error.message}`, "error");
    }
  });

  const handleOptimize = () => {
    if (!inputText.trim()) {
      showToast("Please enter some text to optimize", "error");
      return;
    }
    
    optimizeMutation.mutate({
      text: inputText,
      type: "general",
      style: selectedStyle || undefined
    });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Original Text</label>
        <Textarea
          id="general-input"
          className="w-full h-32 p-3 border border-neutral-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Paste or type your text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
      
      <OptimizationOptions 
        selectedStyle={selectedStyle}
        onSelectStyle={setSelectedStyle}
      />
      
      <Button
        id="optimize-general"
        className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center justify-center mb-4"
        onClick={handleOptimize}
        disabled={optimizeMutation.isPending}
      >
        {optimizeMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Optimizing...
          </>
        ) : (
          <>
            <MaterialIcon name="auto_fix_high" className="mr-2" />
            Optimize Text
          </>
        )}
      </Button>
      
      {showResult && (
        <div id="general-result-container" className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">Optimized Result</label>
            <button 
              id="copy-general-result" 
              className="text-xs flex items-center text-primary hover:text-primary/80"
              onClick={() => onCopy(optimizedText)}
            >
              <MaterialIcon name="content_copy" className="text-sm mr-1" />
              Copy
            </button>
          </div>
          <div id="general-result" className="w-full h-32 p-3 bg-neutral-light rounded-md overflow-auto text-sm">
            {optimizedText}
          </div>
        </div>
      )}
    </div>
  );
}
