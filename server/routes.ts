import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { optimizeText, optimizeWebsitePrompt } from "./optimize";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints
  
  // Optimize endpoint
  app.post("/api/optimize", async (req, res) => {
    try {
      const { text, type, style, options } = req.body;
      
      if (!text || !type) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      let optimizedText = "";
      
      if (type === "general") {
        optimizedText = await optimizeText(text, style);
      } else if (type === "website") {
        optimizedText = await optimizeWebsitePrompt(text, options);
      } else {
        return res.status(400).json({ message: "Invalid optimization type" });
      }
      
      // Save to history if successful
      const historyItem = {
        id: Date.now().toString(),
        type,
        originalText: text,
        optimizedText,
        timestamp: new Date(),
        style: style || null,
        websiteType: type === "website" ? options?.websiteType || null : null,
        designStyle: type === "website" ? options?.designStyle || null : null
      };
      
      await storage.saveHistoryItem(historyItem);
      
      res.json({ optimizedText });
    } catch (error: any) {
      console.error("Optimization error:", error);
      res.status(500).json({ message: "Failed to optimize text", error: error.message });
    }
  });
  
  // Get history endpoint
  app.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getHistory();
      res.json(history);
    } catch (error: any) {
      console.error("History fetch error:", error);
      res.status(500).json({ message: "Failed to fetch history", error: error.message });
    }
  });
  
  // Clear history endpoint
  app.delete("/api/history", async (req, res) => {
    try {
      await storage.clearHistory();
      res.json({ message: "History cleared successfully" });
    } catch (error: any) {
      console.error("History clear error:", error);
      res.status(500).json({ message: "Failed to clear history", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
