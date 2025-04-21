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
 * with modern, elegant design
 * 
 * @returns {HTMLElement} The created button element
 */
function createToggleButton() {
  // Remove any existing button first
  const existingButton = document.getElementById('promptpolish-toggle-container');
  if (existingButton) {
    document.body.removeChild(existingButton);
  }

  // Add CSS for animations and styling
  if (!document.getElementById('promptpolish-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'promptpolish-styles';
    styleEl.textContent = `
      @keyframes promptpolish-spin {
        to { transform: rotate(360deg); }
      }
      @keyframes promptpolish-fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes promptpolish-glow {
        0% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.6); }
        50% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.8); }
        100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.6); }
      }
      .promptpolish-active-glow {
        animation: promptpolish-glow 2s infinite;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Create the button container with modern styling
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'promptpolish-toggle-container';
  buttonContainer.style.position = 'fixed';
  buttonContainer.style.bottom = '24px';
  buttonContainer.style.left = '24px';
  buttonContainer.style.zIndex = '999999';
  buttonContainer.style.pointerEvents = 'auto';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.flexDirection = 'row';
  buttonContainer.style.alignItems = 'center';
  buttonContainer.style.animation = 'promptpolish-fade-in 0.5s ease-out';
  
  // Create the toggle switch container
  const toggleContainer = document.createElement('div');
  toggleContainer.style.display = 'flex';
  toggleContainer.style.alignItems = 'center';
  toggleContainer.style.padding = '8px 12px 8px 10px';
  toggleContainer.style.backdropFilter = 'blur(8px)';
  toggleContainer.style.backgroundColor = 'rgba(16, 16, 20, 0.8)';
  toggleContainer.style.border = '1px solid rgba(255, 255, 255, 0.08)';
  toggleContainer.style.borderRadius = '28px';
  toggleContainer.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
  toggleContainer.style.cursor = 'pointer';
  toggleContainer.style.transition = 'all 0.3s ease';
  toggleContainer.id = 'promptpolish-toggle';
  
  // Create the icon element
  const icon = document.createElement('div');
  icon.style.width = '28px';
  icon.style.height = '28px';
  icon.style.borderRadius = '50%';
  icon.style.display = 'flex';
  icon.style.alignItems = 'center';
  icon.style.justifyContent = 'center';
  icon.style.marginRight = '8px';
  icon.style.transition = 'all 0.3s ease';
  icon.style.flexShrink = '0';
  icon.style.fontSize = '14px';
  icon.innerHTML = '✨';
  icon.className = 'promptpolish-active-glow';
  
  // Create the text element
  const text = document.createElement('span');
  text.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  text.style.fontSize = '13px';
  text.style.fontWeight = '500';
  text.style.color = 'white';
  text.style.transition = 'all 0.3s ease';
  text.style.whiteSpace = 'nowrap';
  text.textContent = 'PromptPolish';
  
  // Create the status indicator
  const statusIndicator = document.createElement('div');
  statusIndicator.style.width = '8px';
  statusIndicator.style.height = '8px';
  statusIndicator.style.borderRadius = '50%';
  statusIndicator.style.marginLeft = '8px';
  statusIndicator.style.transition = 'all 0.3s ease';
  statusIndicator.style.backgroundColor = '#22c55e';
  statusIndicator.style.boxShadow = '0 0 5px #22c55e';
  statusIndicator.id = 'promptpolish-status-indicator';
  
  // Add elements to toggle container
  toggleContainer.appendChild(icon);
  toggleContainer.appendChild(text);
  toggleContainer.appendChild(statusIndicator);
  
  // Add hover effect
  toggleContainer.onmouseover = () => {
    toggleContainer.style.transform = 'translateY(-2px)';
    toggleContainer.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
  };
  
  toggleContainer.onmouseout = () => {
    toggleContainer.style.transform = 'translateY(0)';
    toggleContainer.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
  };
  
  // Set initial state appearance
  updateToggleAppearance(toggleContainer, isOptimizationEnabled);
  
  // Handle click event
  toggleContainer.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('PromptPolish: Toggle button clicked');
    isOptimizationEnabled = !isOptimizationEnabled;
    
    // Update appearance
    updateToggleAppearance(toggleContainer, isOptimizationEnabled);
    
    // Show notification
    const message = isOptimizationEnabled 
      ? 'PromptPolish enabled - Your prompts will now be optimized automatically' 
      : 'PromptPolish disabled - Your prompts will be sent as-is';
      
    showNotification(message, isOptimizationEnabled ? 'success' : 'info');
    
    // Save the state to storage for persistence across page reloads
    try {
      chrome.storage.local.set({ 'promptpolish_enabled': isOptimizationEnabled });
      console.log('PromptPolish: Saved state to storage:', isOptimizationEnabled);
    } catch (error) {
      console.error('PromptPolish: Failed to save state:', error);
    }
    
    return false;
  };
  
  // Add toggle to container and container to document
  buttonContainer.appendChild(toggleContainer);
  document.body.appendChild(buttonContainer);
  
  console.log('PromptPolish: Toggle button created');
  return toggleContainer;
}

/**
 * Updates the appearance of the toggle button based on its state
 * 
 * @param {HTMLElement} toggleElement - The toggle element to update
 * @param {boolean} enabled - Whether the toggle is enabled
 */
function updateToggleAppearance(toggleElement, enabled) {
  const icon = toggleElement.querySelector('div:first-child');
  const statusIndicator = document.getElementById('promptpolish-status-indicator');
  
  if (enabled) {
    statusIndicator.style.backgroundColor = '#22c55e';
    statusIndicator.style.boxShadow = '0 0 5px #22c55e';
    icon.className = 'promptpolish-active-glow';
  } else {
    statusIndicator.style.backgroundColor = '#6b7280';
    statusIndicator.style.boxShadow = 'none';
    icon.className = '';
  }
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
        
        // Button appearance is handled by updateToggleAppearance function in createToggleButton
        
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
        
        // Show a loading indicator with more specific message
        showNotification(`Enhancing your ${platform.type === 'website' ? 'website description' : 'prompt'} for better results...`, "loading");
        
        // Optimize the text
        try {
          const optimizedText = await optimizeText(text, platform.type);
          
          // Update the input with the optimized text
          if (inputElement.tagName.toLowerCase() === 'textarea') {
            inputElement.value = optimizedText;
          } else if (inputElement.getAttribute('contenteditable') === 'true') {
            inputElement.textContent = optimizedText;
          }
          
          // Notify the user with a more specific, helpful message
          const successMessage = platform.type === 'website' 
            ? "Website description enhanced! Press Enter to generate the perfect website." 
            : "Prompt optimized for clarity and effectiveness! Press Enter to send.";
            
          showNotification(successMessage, "success");
          
          // Focus on the input element
          inputElement.focus();
          
          // Simulate an input event to trigger any necessary UI updates
          inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        } catch (error) {
          console.error("Optimization failed:", error);
          showNotification("Optimization failed. Your original message will be sent instead.", "error");
          
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
        
        // Show notification with more detailed information
        const optimizationType = request.type === 'website' 
          ? 'Website description enhanced with best practices and structure!'
          : 'Prompt optimized for clarity and effectiveness!';
        
        showNotification(`${optimizationType} Copied to clipboard and ready to use.`, "success");
      } else {
        showNotification("Optimization failed. Please check your connection and try again.", "error");
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

/**
 * Shows a beautifully designed notification
 * 
 * @param {string} message - The message to display in the notification
 * @param {string} type - The type of notification (success, error, loading, info)
 * @returns {HTMLElement} The created notification element
 */
function showNotification(message, type = "success") {
  // Remove any existing notification
  const existingNotification = document.getElementById('promptpolish-notification');
  if (existingNotification) {
    existingNotification.classList.add('promptpolish-fade-out');
    setTimeout(() => {
      if (document.body.contains(existingNotification)) {
        document.body.removeChild(existingNotification);
      }
    }, 300);
  }
  
  // Create notification container
  const notificationContainer = document.createElement('div');
  notificationContainer.id = 'promptpolish-notification';
  notificationContainer.style.position = 'fixed';
  notificationContainer.style.bottom = '24px';
  notificationContainer.style.right = '24px';
  notificationContainer.style.zIndex = '999999';
  notificationContainer.style.maxWidth = '320px';
  notificationContainer.style.width = 'auto';
  notificationContainer.style.opacity = '0';
  notificationContainer.style.transform = 'translateY(10px)';
  notificationContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  notificationContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  
  // Create notification content
  const notification = document.createElement('div');
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.padding = '12px 16px';
  notification.style.borderRadius = '12px';
  notification.style.backdropFilter = 'blur(10px)';
  notification.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.08)';
  notification.style.border = '1px solid rgba(255, 255, 255, 0.08)';
  notification.style.animation = 'promptpolish-fade-in 0.3s ease forwards';
  
  // Set styles based on notification type
  let iconContent, borderColor, iconColor, bgColor;
  
  if (type === "loading") {
    iconContent = '';
    borderColor = 'rgba(59, 130, 246, 0.2)';
    iconColor = '#3b82f6';
    bgColor = 'rgba(59, 130, 246, 0.05)';
    notification.style.border = `1px solid ${borderColor}`;
    notification.style.backgroundColor = bgColor;
  } else if (type === "success") {
    iconContent = '✓';
    borderColor = 'rgba(34, 197, 94, 0.2)';
    iconColor = '#22c55e';
    bgColor = 'rgba(34, 197, 94, 0.05)';
    notification.style.border = `1px solid ${borderColor}`;
    notification.style.backgroundColor = bgColor;
  } else if (type === "error") {
    iconContent = '✕';
    borderColor = 'rgba(239, 68, 68, 0.2)';
    iconColor = '#ef4444';
    bgColor = 'rgba(239, 68, 68, 0.05)';
    notification.style.border = `1px solid ${borderColor}`;
    notification.style.backgroundColor = bgColor;
  } else if (type === "info") {
    iconContent = 'i';
    borderColor = 'rgba(100, 116, 139, 0.2)';
    iconColor = '#64748b';
    bgColor = 'rgba(100, 116, 139, 0.05)';
    notification.style.border = `1px solid ${borderColor}`;
    notification.style.backgroundColor = bgColor;
  }
  
  // Create icon
  const icon = document.createElement('div');
  icon.style.width = '24px';
  icon.style.height = '24px';
  icon.style.minWidth = '24px'; // Ensure consistent width
  icon.style.borderRadius = '50%';
  icon.style.backgroundColor = iconColor;
  icon.style.color = 'white';
  icon.style.display = 'flex';
  icon.style.alignItems = 'center';
  icon.style.justifyContent = 'center';
  icon.style.marginRight = '12px';
  icon.style.fontSize = '14px';
  icon.style.fontWeight = 'bold';
  
  // If loading, use spinner instead of text
  if (type === "loading") {
    const spinner = document.createElement('div');
    spinner.style.width = '14px';
    spinner.style.height = '14px';
    spinner.style.border = '2px solid rgba(255, 255, 255, 0.3)';
    spinner.style.borderTopColor = 'white';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'promptpolish-spin 1s linear infinite';
    icon.appendChild(spinner);
  } else {
    icon.textContent = iconContent;
  }
  
  // Create message text
  const content = document.createElement('div');
  content.style.flex = '1';
  
  const title = document.createElement('div');
  title.style.fontSize = '14px';
  title.style.fontWeight = '500';
  title.style.color = '#1e293b'; // dark slate
  title.style.marginBottom = '2px';
  title.style.lineHeight = '1.4';
  
  if (type === "loading") {
    title.textContent = 'Optimizing...';
  } else if (type === "success") {
    title.textContent = 'Success';
  } else if (type === "error") {
    title.textContent = 'Error';
  } else if (type === "info") {
    title.textContent = 'Information';
  }
  
  const messageText = document.createElement('div');
  messageText.style.fontSize = '13px';
  messageText.style.color = '#64748b'; // slate
  messageText.style.lineHeight = '1.4';
  messageText.textContent = message;
  
  content.appendChild(title);
  content.appendChild(messageText);
  
  // Create close button
  const closeButton = document.createElement('div');
  closeButton.style.width = '16px';
  closeButton.style.height = '16px';
  closeButton.style.marginLeft = '12px';
  closeButton.style.display = 'flex';
  closeButton.style.alignItems = 'center';
  closeButton.style.justifyContent = 'center';
  closeButton.style.cursor = 'pointer';
  closeButton.style.borderRadius = '50%';
  closeButton.style.color = '#94a3b8'; // light slate
  closeButton.style.fontSize = '14px';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.opacity = '0.7';
  closeButton.style.transition = 'all 0.2s ease';
  closeButton.innerHTML = '×';
  
  closeButton.onmouseover = () => {
    closeButton.style.opacity = '1';
    closeButton.style.backgroundColor = 'rgba(148, 163, 184, 0.1)';
  };
  
  closeButton.onmouseout = () => {
    closeButton.style.opacity = '0.7';
    closeButton.style.backgroundColor = 'transparent';
  };
  
  closeButton.onclick = (e) => {
    e.stopPropagation();
    notificationContainer.classList.add('promptpolish-fade-out');
    setTimeout(() => {
      if (document.body.contains(notificationContainer)) {
        document.body.removeChild(notificationContainer);
      }
    }, 300);
  };
  
  // Add all elements to the notification
  notification.appendChild(icon);
  notification.appendChild(content);
  
  // Only add close button for non-loading notifications
  if (type !== "loading") {
    notification.appendChild(closeButton);
  }
  
  notificationContainer.appendChild(notification);
  document.body.appendChild(notificationContainer);
  
  // Animate in
  setTimeout(() => {
    notificationContainer.style.opacity = '1';
    notificationContainer.style.transform = 'translateY(0)';
  }, 10);
  
  // Add CSS for animations if not already present
  if (!document.getElementById('promptpolish-notification-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'promptpolish-notification-styles';
    styleEl.textContent = `
      @keyframes promptpolish-fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .promptpolish-fade-out {
        opacity: 0 !important;
        transform: translateY(10px) !important;
      }
    `;
    document.head.appendChild(styleEl);
  }
  
  // Auto-remove after delay unless it's a loading notification
  if (type !== "loading") {
    setTimeout(() => {
      notificationContainer.classList.add('promptpolish-fade-out');
      setTimeout(() => {
        if (document.body.contains(notificationContainer)) {
          document.body.removeChild(notificationContainer);
        }
      }, 300);
    }, 5000);
  }
  
  return notificationContainer;
}
