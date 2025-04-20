import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getHistory, clearHistory } from "@/lib/storage";
import { OptimizationItem } from "@/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

// Material icons via Google Fonts CDN
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => {
  return <span className={`material-icons ${className}`}>{name}</span>;
};

interface HistoryTabProps {
  onCopy: (text: string) => void;
  showToast: (message: string, type?: "success" | "error") => void;
}

export default function HistoryTab({ onCopy, showToast }: HistoryTabProps) {
  const { data: historyItems = [], isLoading, error } = useQuery({
    queryKey: ["/api/history"],
    queryFn: async () => {
      // First try to get from local storage
      const localItems = await getHistory();
      if (localItems.length > 0) {
        return localItems;
      }
      
      // If no local items, try to get from server
      try {
        const response = await apiRequest("GET", "/api/history");
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Failed to fetch history from server:", error);
        return [];
      }
    }
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      // Clear local storage
      await clearHistory();
      
      // Try to clear server storage too
      try {
        await apiRequest("DELETE", "/api/history");
      } catch (error) {
        console.error("Failed to clear history from server:", error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      showToast("History cleared successfully");
    },
    onError: (error) => {
      showToast(`Failed to clear history: ${error.message}`, "error");
    }
  });

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      clearHistoryMutation.mutate();
    }
  };

  const handleRestore = (item: OptimizationItem) => {
    // This would typically open the appropriate tab and fill in the form
    showToast(`Restored ${item.type} optimization`);
    
    // Send a message to the background script to handle the tab switching
    if (chrome && chrome.runtime) {
      chrome.runtime.sendMessage({
        action: "restoreItem",
        item: item
      });
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "some time ago";
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading history...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-error">Error loading history</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-md font-medium">Recent Optimizations</h2>
        <button 
          className="text-xs text-primary hover:text-primary/80"
          onClick={handleClearAll}
          disabled={clearHistoryMutation.isPending}
        >
          Clear All
        </button>
      </div>
      
      {historyItems.length === 0 ? (
        <div className="text-center py-8 text-sm text-neutral-dark">
          <p>No optimization history yet</p>
        </div>
      ) : (
        <>
          {historyItems.map((item: OptimizationItem) => (
            <div key={item.id} className="mb-3 p-3 bg-neutral-light rounded-md">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium truncate flex-1">
                  {item.type === "general" ? "General Optimization" : "Website Prompt"}
                </p>
                <span className="text-xs text-neutral-dark">{formatTime(item.timestamp)}</span>
              </div>
              <p className="text-xs text-neutral-dark mb-2 line-clamp-2">{item.originalText}</p>
              <div className="flex justify-between">
                <button 
                  className="text-xs text-primary hover:text-primary/80 flex items-center"
                  onClick={() => handleRestore(item)}
                >
                  <MaterialIcon name="restore" className="text-sm mr-1" />
                  Restore
                </button>
                <button 
                  className="text-xs text-primary hover:text-primary/80 flex items-center"
                  onClick={() => onCopy(item.optimizedText)}
                >
                  <MaterialIcon name="content_copy" className="text-sm mr-1" />
                  Copy
                </button>
              </div>
            </div>
          ))}
          
          <div className="text-center py-4 text-sm text-neutral-dark">
            <p>End of history</p>
          </div>
        </>
      )}
    </div>
  );
}
