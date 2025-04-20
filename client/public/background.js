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

// Handle context menu clicks
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

// Listen for messages from content script or popup
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
    const apiUrl = `http://localhost:5000/api/optimize`;
    
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.data)
    })
      .then(response => response.json())
      .then(data => {
        sendResponse({ success: true, result: data });
      })
      .catch(error => {
        console.error('Optimization error:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Required for async sendResponse
  }
});
