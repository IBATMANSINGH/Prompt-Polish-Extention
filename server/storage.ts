import { optimizationHistory, type OptimizationItem, type InsertOptimizationItem, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveHistoryItem(item: OptimizationItem): Promise<OptimizationItem>;
  getHistory(): Promise<OptimizationItem[]>;
  clearHistory(): Promise<void>;
  getHistoryItem(id: string): Promise<OptimizationItem | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private history: Map<string, OptimizationItem>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.history = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveHistoryItem(item: OptimizationItem): Promise<OptimizationItem> {
    this.history.set(item.id, item);
    return item;
  }

  async getHistory(): Promise<OptimizationItem[]> {
    return Array.from(this.history.values()).sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  async clearHistory(): Promise<void> {
    this.history.clear();
  }

  async getHistoryItem(id: string): Promise<OptimizationItem | undefined> {
    return this.history.get(id);
  }
}

export const storage = new MemStorage();
