# ✨ PromptPolish


<p align="center">
  <strong>AI-powered prompt optimization for ChatGPT, Claude, Bard and other LLMs</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#supported-platforms">Supported Platforms</a> •
  <a href="#development">Development</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="docs/images/demo.gif" alt="PromptPolish Demo" width="800">
</p>

PromptPolish is a Chrome and Edge browser extension that automatically enhances your prompts for AI chatbots and agents. It intercepts your messages when you press Enter, optimizes them using advanced prompt engineering techniques, and then forwards the improved prompt to the AI.

## ✨ Features

- **Auto-Detection**: Automatically detects popular AI chat interfaces like ChatGPT, Claude, Bard, and more
- **One-Click Toggle**: Easily enable or disable the extension with a single click
- **Seamless Integration**: Works directly in the chat interface with minimal disruption
- **Custom Optimization Styles**: Choose from professional, concise, friendly, persuasive, or technical writing styles
- **Website Creation Prompts**: Specialized optimization for prompts that ask AI to create websites
- **Advanced Prompt Engineering**: Leverages Claude 3.7 Sonnet for state-of-the-art prompt enhancement
- **History Tracking**: View and restore previously optimized prompts

## 📋 Supported Platforms

PromptPolish automatically detects and works with these AI platforms:

- ChatGPT (chat.openai.com)
- Claude (claude.ai)
- Google Bard/Gemini (bard.google.com)
- Bing Chat (www.bing.com)
- Perplexity (www.perplexity.ai)
- MidJourney (www.midjourney.com)
- Hugging Face Chat (huggingface.co)
- Vercel AI Playground (play.vercel.ai)
- WebChatGPT (webchatgpt.io)
- Phind (www.phind.com)

## 🚀 Installation

### Chrome Web Store (Coming Soon)
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "PromptPolish"
3. Click "Add to Chrome"

### Manual Installation
1. Download the latest release from the [Releases page](https://github.com/yourusername/promptpolish/releases)
2. Unzip the file
3. In Chrome/Edge, go to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the unzipped folder

## 🔧 Usage

### Basic Usage
1. Visit any supported AI chat platform
2. Notice the PromptPolish toggle button appear in the bottom-left corner
3. Type your message normally
4. Press Enter - PromptPolish will intercept your message, optimize it, and show a notification
5. Press Enter again to send the optimized message

### Using the Extension Popup
1. Click the PromptPolish extension icon in your browser toolbar
2. Choose the "General" tab for regular text optimization or "Website" tab for website creation prompts
3. Enter your text and click "Optimize"
4. Copy the optimized result to your clipboard

### Optimization Styles
For general text optimization, choose from these styles:
- **Professional**: Formal language with industry-specific terminology
- **Concise**: Reduced word count while preserving key information
- **Friendly**: Conversational language with a warm tone
- **Persuasive**: Enhanced with persuasive techniques and compelling calls to action
- **Technical**: Precise, domain-specific terminology with logical structure

### Context Menu
Right-click on any selected text on the web and choose:
- "PromptPolish > Optimize Selected Text" for general optimization
- "PromptPolish > Optimize for Website Creation" to enhance website creation prompts

## 🛠️ Development

### Requirements
- Node.js 16+
- npm or yarn

### Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/promptpolish.git
cd promptpolish
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with:
```
OPENROUTER_API_KEY=your_openrouter_api_key
```

4. Start the development server
```bash
npm run dev
```

5. Load the extension in Chrome/Edge
- Go to `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `client/public` folder

### Building for Production
```bash
npm run build
```
The built extension will be in the `dist` directory.

## 📚 How It Works

PromptPolish uses a two-part system:

1. **Browser Extension**: Detects AI interfaces, intercepts user input, and communicates with the API server
2. **API Server**: Processes optimization requests using the OpenRouter API to access Claude 3.7 Sonnet

The prompt optimization uses advanced prompt engineering techniques tailored to different content types and styles. For website creation prompts, it adds specialized guidance for different website types, design styles, and features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [OpenRouter](https://openrouter.ai/) for providing API access to multiple AI models
- [Anthropic's Claude](https://www.anthropic.com/claude) for powering the optimization engine
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- All contributors and testers who helped improve this extension

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/IBATMANSINGH">Ankit Singh</a>
</p>
