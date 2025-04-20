import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { addToHistory } from "@/lib/storage";

// Material icons via Google Fonts CDN
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => {
  return <span className={`material-icons ${className}`}>{name}</span>;
};

interface WebsiteTabProps {
  onCopy: (text: string) => void;
  showToast: (message: string, type?: "success" | "error") => void;
}

interface WebsiteFeature {
  id: string;
  label: string;
  checked: boolean;
}

export default function WebsiteTab({ onCopy, showToast }: WebsiteTabProps) {
  const [description, setDescription] = useState("");
  const [websiteType, setWebsiteType] = useState("business");
  const [designStyle, setDesignStyle] = useState("modern");
  const [features, setFeatures] = useState<WebsiteFeature[]>([
    { id: "responsive", label: "Responsive Design", checked: true },
    { id: "seo", label: "SEO Friendly", checked: true },
    { id: "contact-form", label: "Contact Form", checked: false },
    { id: "social-media", label: "Social Media", checked: false },
    { id: "animations", label: "Animations", checked: false },
    { id: "analytics", label: "Analytics", checked: false },
  ]);
  
  const [optimizedText, setOptimizedText] = useState("");
  const [showResult, setShowResult] = useState(false);

  const toggleFeature = (id: string) => {
    setFeatures(features.map(feature => 
      feature.id === id ? { ...feature, checked: !feature.checked } : feature
    ));
  };

  const optimizeMutation = useMutation({
    mutationFn: async (data: { 
      text: string; 
      type: string; 
      options: {
        websiteType: string;
        designStyle: string;
        features: string[];
      } 
    }) => {
      const response = await apiRequest("POST", "/api/optimize", data);
      return response.json();
    },
    onSuccess: (data) => {
      setOptimizedText(data.optimizedText);
      setShowResult(true);
      
      // Add to history
      addToHistory({
        id: Date.now().toString(),
        type: "website",
        originalText: description,
        optimizedText: data.optimizedText,
        timestamp: new Date().toISOString(),
        websiteType,
        designStyle
      });
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
    },
    onError: (error) => {
      showToast(`Optimization failed: ${error.message}`, "error");
    }
  });

  const handleOptimize = () => {
    if (!description.trim()) {
      showToast("Please enter a website description", "error");
      return;
    }
    
    const selectedFeatures = features
      .filter(feature => feature.checked)
      .map(feature => feature.id);
    
    optimizeMutation.mutate({
      text: description,
      type: "website",
      options: {
        websiteType,
        designStyle,
        features: selectedFeatures
      }
    });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Label className="block text-sm font-medium mb-1">Website Description</Label>
        <Textarea
          id="website-input"
          className="w-full h-24 p-3 border border-neutral-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Describe the website you want to create..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <Label className="block text-sm font-medium mb-1">Website Type</Label>
          <Select value={websiteType} onValueChange={setWebsiteType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="portfolio">Portfolio</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-sm font-medium mb-1">Design Style</Label>
          <Select value={designStyle} onValueChange={setDesignStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="minimalist">Minimalist</SelectItem>
              <SelectItem value="colorful">Colorful</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Include Details:</p>
        <div className="grid grid-cols-2 gap-2">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center">
              <Checkbox 
                id={feature.id} 
                checked={feature.checked}
                onCheckedChange={() => toggleFeature(feature.id)}
                className="mr-2"
              />
              <Label htmlFor={feature.id} className="text-sm">{feature.label}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <Button
        id="optimize-website"
        className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center justify-center mb-4"
        onClick={handleOptimize}
        disabled={optimizeMutation.isPending}
      >
        {optimizeMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <MaterialIcon name="auto_fix_high" className="mr-2" />
            Generate Optimized Prompt
          </>
        )}
      </Button>
      
      {showResult && (
        <div id="website-result-container" className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">Optimized Website Prompt</label>
            <button 
              id="copy-website-result" 
              className="text-xs flex items-center text-primary hover:text-primary/80"
              onClick={() => onCopy(optimizedText)}
            >
              <MaterialIcon name="content_copy" className="text-sm mr-1" />
              Copy
            </button>
          </div>
          <div id="website-result" className="w-full h-32 p-3 bg-neutral-light rounded-md overflow-auto text-sm">
            {optimizedText}
          </div>
        </div>
      )}
    </div>
  );
}
