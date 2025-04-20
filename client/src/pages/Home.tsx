import { useState } from "react";
import GeneralTab from "@/components/GeneralTab";
import WebsiteTab from "@/components/WebsiteTab";
import HistoryTab from "@/components/HistoryTab";
import Toast from "@/components/Toast";
import { OptimizationItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Material icons via Google Fonts CDN
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => {
  return <span className={`material-icons ${className}`}>{name}</span>;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"general" | "website" | "history">("general");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const { toast } = useToast();

  const showToast = (message: string, type: "success" | "error" = "success") => {
    toast({
      title: message,
      variant: type === "success" ? "default" : "destructive",
    });
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        showToast("Copied to clipboard!");
      },
      () => {
        showToast("Failed to copy to clipboard", "error");
      }
    );
  };

  return (
    <div className="flex flex-col h-full bg-white text-neutral-dark">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-medium">
        <div className="flex items-center">
          <MaterialIcon name="auto_fix_high" className="text-primary mr-2" />
          <h1 className="text-lg font-semibold">PromptPolish</h1>
        </div>
        <div className="flex">
          <button className="p-2 rounded-full hover:bg-neutral-light" aria-label="Settings">
            <MaterialIcon name="settings" />
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex border-b border-neutral-medium">
        <button
          className={`py-3 px-4 font-medium ${
            activeTab === "general" 
              ? "text-primary border-b-2 border-primary" 
              : "text-neutral-dark hover:text-primary"
          } flex-1`}
          onClick={() => setActiveTab("general")}
        >
          General
        </button>
        <button
          className={`py-3 px-4 font-medium ${
            activeTab === "website" 
              ? "text-primary border-b-2 border-primary" 
              : "text-neutral-dark hover:text-primary"
          } flex-1`}
          onClick={() => setActiveTab("website")}
        >
          Website
        </button>
        <button
          className={`py-3 px-4 font-medium ${
            activeTab === "history" 
              ? "text-primary border-b-2 border-primary" 
              : "text-neutral-dark hover:text-primary"
          } flex-1`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === "general" && (
          <GeneralTab onCopy={handleCopyToClipboard} showToast={showToast} />
        )}
        {activeTab === "website" && (
          <WebsiteTab onCopy={handleCopyToClipboard} showToast={showToast} />
        )}
        {activeTab === "history" && (
          <HistoryTab onCopy={handleCopyToClipboard} showToast={showToast} />
        )}
      </div>

      {/* Footer */}
      <footer className="px-4 py-2 border-t border-neutral-medium bg-neutral-light text-xs text-center text-neutral-dark">
        <p>
          PromptPolish v1.0 • <a href="#" className="text-primary hover:underline">Help</a> • <a href="#" className="text-primary hover:underline">Feedback</a>
        </p>
      </footer>

      {toastVisible && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastVisible(false)} />
      )}
    </div>
  );
}
