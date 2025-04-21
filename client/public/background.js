/**
 * PromptPolish - Background Script
 * 
 * This background script handles:
 * - Context menu setup for optimizing selected text
 * - API communication for prompt optimization
 * - Message passing between popup/content scripts and API
 * 
 * The script provides two main optimization paths:
 * 1. Context menu-based optimization for selected text
 * 2. API forwarding for optimization requests from content scripts and popup
 */

// Set up context menu items when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // Create a parent menu item
  chrome.contextMenus.create({
    id: "promptpolish",
    title: "PromptPolish",
    contexts: ["selection"]
  });

  // Create two child menu items
  chrome.contextMenus.create({
    id: "optimize-general",
    parentId: "promptpolish",
    title: "Optimize Selected Text",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "optimize-website",
    parentId: "promptpolish",
    title: "Optimize for Website Creation",
    contexts: ["selection"]
  });
});

/**
 * Handle context menu clicks
 * 
 * When the user right-clicks on selected text and chooses one of our
 * optimization options, this handler sends a message to the content script
 * to process the selected text according to the chosen optimization type.
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "optimize-general") {
    // Send message to content script to handle general optimization
    chrome.tabs.sendMessage(tab.id, {
      action: "optimize",
      type: "general",
      text: info.selectionText
    });
  } else if (info.menuItemId === "optimize-website") {
    // Send message to content script to handle website optimization
    chrome.tabs.sendMessage(tab.id, {
      action: "optimize",
      type: "website",
      text: info.selectionText
    });
  }
});

/**
 * Message handler for communication between components
 * 
 * This listener handles two main types of messages:
 * 1. "getSelectedText" - Gets the selected text from the active tab
 * 2. "optimizeFromPopup" - Forwards optimization requests to the API server
 * 
 * The listener sets up proper error handling and fallbacks for API failures.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    // Get the active tab and send a message to get selected text
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, (response) => {
          sendResponse(response);
        });
        return true; // Required for async sendResponse
      }
    });
    return true; // Required for async sendResponse
  } else if (request.action === "optimizeFromPopup") {
    // Forward optimization requests from popup to the API
    // In production, this would point to your deployed API endpoint
    const apiUrl = `http://localhost:5000/api/optimize`;
    
    // Log the optimization request for debugging
    console.log("PromptPolish: Optimizing text", {
      type: request.data.type,
      textLength: request.data.text.length,
      options: request.data.options
    });
    
    // Make the API request with proper error handling
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(request.data)
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`API Error (${response.status}): ${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log("PromptPolish: Optimization successful");
        sendResponse({ success: true, result: data });
      })
      .catch(error => {
        console.error('PromptPolish optimization error:', error);
        
        // If the API is unavailable (likely CORS issues in development), provide a fallback response
        // This allows for testing the extension without the backend running
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          console.log('PromptPolish: Using fallback optimization due to connection error');
          
          // For demo/development purposes only - in production, this would rely on the actual API
          const fallbackOptimizedText = `[Optimized by PromptPolish]\n\n${request.data.text}`;
          sendResponse({ 
            success: true, 
            result: { optimizedText: fallbackOptimizedText },
            fallback: true
          });
        } else {
          sendResponse({ success: false, error: error.message });
        }
      });
    
    return true; // Required for async sendResponse
  }
});
