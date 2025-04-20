import { OptimizationItem } from "@/types";

const STORAGE_KEY = "promptpolish_history";

// Get all history items
export const getHistory = async (): Promise<OptimizationItem[]> => {
  try {
    // For browser extensions
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
          resolve(result[STORAGE_KEY] || []);
        });
      });
    } 
    // For web app
    else {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    }
  } catch (error) {
    console.error("Error getting history:", error);
    return [];
  }
};

// Add an item to history
export const addToHistory = async (item: OptimizationItem): Promise<void> => {
  try {
    const history = await getHistory();
    
    // Add new item at the beginning
    const updatedHistory = [item, ...history].slice(0, 50); // Keep only the latest 50 items
    
    // For browser extensions
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ [STORAGE_KEY]: updatedHistory });
    } 
    // For web app
    else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    }
  } catch (error) {
    console.error("Error adding to history:", error);
  }
};

// Clear all history
export const clearHistory = async (): Promise<void> => {
  try {
    // For browser extensions
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.remove([STORAGE_KEY]);
    } 
    // For web app
    else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Error clearing history:", error);
  }
};

// Remove a specific item from history
export const removeFromHistory = async (id: string): Promise<void> => {
  try {
    const history = await getHistory();
    const updatedHistory = history.filter((item) => item.id !== id);
    
    // For browser extensions
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ [STORAGE_KEY]: updatedHistory });
    } 
    // For web app
    else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    }
  } catch (error) {
    console.error("Error removing from history:", error);
  }
};
