// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    // Get selected text from the page
    const selectedText = window.getSelection().toString().trim();
    sendResponse({ text: selectedText });
  } else if (request.action === "optimize") {
    // Handle optimization request from context menu
    // First, get the selected text
    const selectedText = window.getSelection().toString().trim();
    
    if (!selectedText) {
      console.error("No text selected");
      return;
    }

    // Prepare data for the optimization request
    const data = {
      type: request.type,
      text: selectedText,
      options: {}
    };

    // If it's a website optimization, add default options
    if (request.type === "website") {
      data.options = {
        websiteType: "business",
        designStyle: "modern",
        features: ["responsive", "seo"]
      };
    }

    // Send to background script for API call
    chrome.runtime.sendMessage({
      action: "optimizeFromPopup",
      data: data
    }, (response) => {
      if (response && response.success) {
        // Copy to clipboard
        copyToClipboard(response.result.optimizedText);
        
        // Show notification
        showNotification("Optimization complete! Copied to clipboard.");
      } else {
        showNotification("Failed to optimize text. Please try again.", "error");
      }
    });
  }
});

// Helper function to copy text to clipboard
function copyToClipboard(text) {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  
  // Select the text and copy it
  textarea.select();
  document.execCommand('copy');
  
  // Remove the textarea
  document.body.removeChild(textarea);
}

// Helper function to show a notification
function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 15px';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '999999';
  notification.style.fontSize = '14px';
  notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  
  // Set color based on type
  if (type === "success") {
    notification.style.backgroundColor = '#22c55e';
    notification.style.color = 'white';
  } else {
    notification.style.backgroundColor = '#ef4444';
    notification.style.color = 'white';
  }
  
  // Add to page and remove after delay
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}
