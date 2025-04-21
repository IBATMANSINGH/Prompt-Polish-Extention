/**
 * PromptPolish - AI Chat Interface Enhancement
 * 
 * This content script detects AI chat interfaces, adds a toggle button to the UI,
 * and intercepts user inputs to optimize prompts before they're sent to the AI.
 * 
 * Features:
 * - Auto-detection of popular AI chat platforms
 * - Prompt interception on Enter key press
 * - API-based prompt optimization
 * - Visual feedback with notifications
 * - Toggle button to enable/disable functionality
 */

/**
 * Configuration for supported AI platforms
 * Each platform configuration contains:
 * - name: Display name of the platform
 * - hostname: URL pattern to match for detection
 * - inputSelector: CSS selector for the input element
 * - submitSelector: CSS selector for the submit button
 * - type: Type of optimization to apply ('general' or 'website')
 */
const AI_PLATFORMS = [
  {
    name: 'ChatGPT',
    hostname: 'chat.openai.com',
    inputSelector: 'textarea[data-id="root"]',
    submitSelector: 'button[data-testid="send-button"]',
    type: 'general'
  },
  {
    name: 'Claude',
    hostname: 'claude.ai',
    inputSelector: 'div[contenteditable="true"]',
    submitSelector: 'button[aria-label="Send message"]',
    type: 'general'
  },
  {
    name: 'Bard',
    hostname: 'bard.google.com',
    inputSelector: 'textarea[placeholder="Enter a prompt here"]',
    submitSelector: 'button[aria-label="Send"]',
    type: 'general'
  },
  {
    name: 'Bing Chat',
    hostname: 'www.bing.com',
    inputSelector: 'textarea#searchbox',
    submitSelector: 'button#search_icon',
    type: 'general'
  },
  {
    name: 'Perplexity',
    hostname: 'www.perplexity.ai',
    inputSelector: 'div[contenteditable="true"]',
    submitSelector: 'button[aria-label="Submit"]',
    type: 'general'
  },
  {
    name: 'MidJourney',
    hostname: 'www.midjourney.com',
    inputSelector: 'textarea[placeholder="Send a message"]',
    submitSelector: 'button[type="submit"]',
    type: 'general' // Could be customized for image generation
  },
  {
    name: 'Hugging Face Chat',
    hostname: 'huggingface.co',
    inputSelector: 'div.chat-input-area textarea',
    submitSelector: 'div.chat-input-area button[type="submit"]',
    type: 'general'
  },
  {
    name: 'Vercel AI Playground',
    hostname: 'play.vercel.ai',
    inputSelector: 'textarea.text-input',
    submitSelector: 'button.send-button',
    type: 'general'
  },
  {
    name: 'WebChatGPT',
    hostname: 'webchatgpt.io',
    inputSelector: 'textarea[aria-label="Chat input"]',
    submitSelector: 'button[aria-label="Send message"]',
    type: 'general'
  },
  {
    name: 'Phind',
    hostname: 'www.phind.com',
    inputSelector: 'textarea.search-input',
    submitSelector: 'button.search-button',
    type: 'general'
  }
];

/**
 * State variables
 */
let currentPlatform = null; // Store the detected AI platform
let isOptimizationEnabled = true; // Default to enabled

/**
 * Detect the current AI platform based on the hostname
 * 
 * @returns {Object|undefined} The platform configuration object if detected, undefined otherwise
 */
function detectAIPlatform() {
  const hostname = window.location.hostname;
  return AI_PLATFORMS.find(platform => hostname.includes(platform.hostname));
}

/**
 * Creates a toggle button for enabling/disabling prompt optimization
 * 
 * @returns {HTMLElement} The created button element
 */
function createToggleButton() {
  // Remove any existing button first
  const existingButton = document.getElementById('promptpolish-toggle');
  if (existingButton) {
    document.body.removeChild(existingButton);
  }

  // Create the button container to ensure proper positioning
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'promptpolish-toggle-container';
  buttonContainer.style.position = 'fixed';
  buttonContainer.style.bottom = '20px';
  buttonContainer.style.left = '20px';
  buttonContainer.style.zIndex = '999999'; // Very high z-index to ensure visibility
  buttonContainer.style.pointerEvents = 'auto'; // Ensure it receives click events
  
  // Create the actual button
  const button = document.createElement('button');
  button.id = 'promptpolish-toggle';
  button.textContent = '✨ PromptPolish: ON';
  button.style.padding = '10px 16px';
  button.style.borderRadius = '6px';
  button.style.backgroundColor = '#22c55e';
  button.style.color = 'white';
  button.style.fontWeight = 'bold';
  button.style.border = 'none';
  button.style.cursor = 'pointer';
  button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
  button.style.fontSize = '14px';
  button.style.transition = 'all 0.3s ease';
  button.style.userSelect = 'none';
  button.style.fontFamily = 'Arial, sans-serif';
  
  // Add hover effect
  button.onmouseover = () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.25)';
  };
  
  button.onmouseout = () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
  };
  
  // Handle click event with explicit logging
  button.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('PromptPolish: Toggle button clicked');
    isOptimizationEnabled = !isOptimizationEnabled;
    
    // Update appearance
    button.textContent = isOptimizationEnabled ? '✨ PromptPolish: ON' : '✨ PromptPolish: OFF';
    button.style.backgroundColor = isOptimizationEnabled ? '#22c55e' : '#64748b';
    
    // Show notification
    showNotification(`PromptPolish ${isOptimizationEnabled ? 'enabled' : 'disabled'}`);
    
    // Save the state to storage for persistence across page reloads
    try {
      chrome.storage.local.set({ 'promptpolish_enabled': isOptimizationEnabled });
      console.log('PromptPolish: Saved state to storage:', isOptimizationEnabled);
    } catch (error) {
      console.error('PromptPolish: Failed to save state:', error);
    }
    
    return false; // Prevent any default behavior
  };
  
  // Add button to container and container to document
  buttonContainer.appendChild(button);
  document.body.appendChild(buttonContainer);
  
  // Log that the button was created
  console.log('PromptPolish: Toggle button created');
  
  return button;
}

/**
 * Initialize the extension and set up UI elements
 * 
 * This function runs when the page loads and:
 * 1. Detects if the current site is a supported AI platform
 * 2. Loads saved preferences from storage
 * 3. Creates the toggle button
 * 4. Sets up input interception
 */
window.addEventListener('load', () => {
  // Check if we're on a supported AI platform
  currentPlatform = detectAIPlatform();
  
  if (currentPlatform) {
    console.log(`PromptPolish: Detected ${currentPlatform.name}`);
    
    // Load saved settings from storage
    try {
      chrome.storage.local.get(['promptpolish_enabled'], (result) => {
        // If we have a saved setting, use it
        if (result.hasOwnProperty('promptpolish_enabled')) {
          isOptimizationEnabled = result.promptpolish_enabled;
          console.log('PromptPolish: Loaded saved state:', isOptimizationEnabled);
        }
        
        // Create UI elements and set up functionality
        const button = createToggleButton();
        
        // Update button appearance to match loaded state
        if (!isOptimizationEnabled) {
          button.textContent = '✨ PromptPolish: OFF';
          button.style.backgroundColor = '#64748b';
        }
        
        // Set up input interception
        setupInputInterception(currentPlatform);
      });
    } catch (error) {
      console.error('PromptPolish: Error loading saved state:', error);
      // Continue with default state
      createToggleButton();
      setupInputInterception(currentPlatform);
    }
  }
});

// Function to intercept input on AI chat platforms
function setupInputInterception(platform) {
  // Use MutationObserver to wait for the input element to appear
  const observer = new MutationObserver((mutations, obs) => {
    const inputElement = document.querySelector(platform.inputSelector);
    if (inputElement) {
      // Input element found, set up the event listeners
      setupInputEventListeners(inputElement, platform);
      obs.disconnect(); // Stop observing once we've found and set up the input
    }
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
}

// Set up event listeners for the input element
function setupInputEventListeners(inputElement, platform) {
  // Handle key press events (Enter key)
  inputElement.addEventListener('keydown', async (event) => {
    // Only intercept if Enter is pressed without Shift and optimization is enabled
    if (event.key === 'Enter' && !event.shiftKey && isOptimizationEnabled) {
      // Get the text from the input element
      let text = '';
      
      if (inputElement.tagName.toLowerCase() === 'textarea') {
        text = inputElement.value;
      } else if (inputElement.getAttribute('contenteditable') === 'true') {
        text = inputElement.textContent;
      }
      
      if (text.trim()) {
        event.preventDefault(); // Prevent the default Enter behavior
        event.stopPropagation(); // Stop the event from propagating
        
        // Show a loading indicator
        showNotification("Optimizing prompt...", "loading");
        
        // Optimize the text
        try {
          const optimizedText = await optimizeText(text, platform.type);
          
          // Update the input with the optimized text
          if (inputElement.tagName.toLowerCase() === 'textarea') {
            inputElement.value = optimizedText;
          } else if (inputElement.getAttribute('contenteditable') === 'true') {
            inputElement.textContent = optimizedText;
          }
          
          // Notify the user
          showNotification("Prompt optimized! Press Enter again to send.");
          
          // Focus on the input element
          inputElement.focus();
          
          // Simulate an input event to trigger any necessary UI updates
          inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        } catch (error) {
          console.error("Optimization failed:", error);
          showNotification("Failed to optimize prompt. Sending original.", "error");
          
          // Send the original text
          setTimeout(() => {
            // Dispatch the Enter key event to send the message
            const enterEvent = new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              which: 13,
              bubbles: true
            });
            inputElement.dispatchEvent(enterEvent);
          }, 500);
        }
      }
    }
  });
}

// Function to optimize text using the background script
function optimizeText(text, type = 'general') {
  return new Promise((resolve, reject) => {
    // Prepare data for the optimization request
    const data = {
      type: type,
      text: text,
      options: {}
    };

    // If it's a website type prompt, add default options
    if (type === "website") {
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
        resolve(response.result.optimizedText);
      } else {
        reject(new Error(response?.error || "Optimization failed"));
      }
    });
  });
}

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
  // Remove any existing notification with id 'promptpolish-notification'
  const existingNotification = document.getElementById('promptpolish-notification');
  if (existingNotification) {
    document.body.removeChild(existingNotification);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'promptpolish-notification';
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 15px';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '999999';
  notification.style.fontSize = '14px';
  notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.gap = '8px';
  
  // Set color and content based on type
  if (type === "loading") {
    notification.style.backgroundColor = '#3b82f6'; // Blue for loading
    notification.style.color = 'white';
    
    // Add spinner for loading state
    const spinner = document.createElement('div');
    spinner.style.width = '16px';
    spinner.style.height = '16px';
    spinner.style.border = '2px solid rgba(255, 255, 255, 0.3)';
    spinner.style.borderRadius = '50%';
    spinner.style.borderTopColor = 'white';
    spinner.style.animation = 'promptpolish-spin 1s linear infinite';
    
    // Add keyframes for spinner animation
    if (!document.getElementById('promptpolish-spinner-style')) {
      const style = document.createElement('style');
      style.id = 'promptpolish-spinner-style';
      style.textContent = `
        @keyframes promptpolish-spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    notification.appendChild(spinner);
  } else if (type === "success") {
    notification.style.backgroundColor = '#22c55e'; // Green for success
    notification.style.color = 'white';
  } else if (type === "error") {
    notification.style.backgroundColor = '#ef4444'; // Red for error
    notification.style.color = 'white';
  } else if (type === "info") {
    notification.style.backgroundColor = '#64748b'; // Slate for info
    notification.style.color = 'white';
  }
  
  // Add message text
  const textSpan = document.createElement('span');
  textSpan.textContent = message;
  notification.appendChild(textSpan);
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after delay unless it's a loading notification
  if (type !== "loading") {
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 3000);
  }
  
  return notification;
}
