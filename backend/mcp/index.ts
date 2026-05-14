#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_KEY = process.env.MCP_API_KEY;
const APP_URL = process.env.APP_URL;

if (!API_KEY) throw new Error("MCP_API_KEY env var is required");
if (!APP_URL) throw new Error("APP_URL env var is required");

const BASE = APP_URL.replace(/\/$/, "");

async function api(method: string, path: string, body?: unknown) {
  const res = await fetch(`${BASE}/api/mcp/${path}`, {
    method,
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

function toText(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

const server = new McpServer({ name: "flashcards", version: "1.0.0" });

// ── list_decks ─────────────────────────────────────────────────────────────

server.tool(
  "list_decks",
  "List all flashcard decks with card counts and due counts",
  {},
  async () => {
    const data = await api("GET", "list-decks");
    return { content: [{ type: "text", text: toText(data) }] };
  },
);

// ── create_deck ────────────────────────────────────────────────────────────

server.tool(
  "create_deck",
  "Create a new flashcard deck",
  {
    name: z.string().min(1).max(100).describe("Deck name"),
    description: z.string().max(500).optional().describe("Optional deck description"),
  },
  async ({ name, description }) => {
    const data = await api("POST", "create-deck", { name, description });
    return { content: [{ type: "text", text: toText(data) }] };
  },
);

// ── add_card ───────────────────────────────────────────────────────────────

server.tool(
  "add_card",
  "Add a single flashcard to a deck",
  {
    deck_id: z.string().describe("The deck ID"),
    front: z.string().min(1).describe("Question / front of card"),
    back: z.string().min(1).describe("Answer / back of card"),
    tags: z.array(z.string()).optional().describe("Optional tags"),
  },
  async (params) => {
    const data = await api("POST", "add-card", params);
    return { content: [{ type: "text", text: toText(data) }] };
  },
);

// ── bulk_add_cards ─────────────────────────────────────────────────────────

server.tool(
  "bulk_add_cards",
  "Add multiple flashcards to a deck at once (up to 100)",
  {
    deck_id: z.string().describe("The deck ID"),
    cards: z
      .array(z.object({ front: z.string().min(1), back: z.string().min(1), tags: z.array(z.string()).optional() }))
      .min(1)
      .max(100)
      .describe("Array of cards to create"),
  },
  async (params) => {
    const data = await api("POST", "bulk-add-cards", params);
    return { content: [{ type: "text", text: toText(data) }] };
  },
);

// ── get_due_cards ──────────────────────────────────────────────────────────

server.tool(
  "get_due_cards",
  "Get flashcards due for review today (SM-2 spaced repetition)",
  {
    deck_id: z.string().optional().describe("Filter to a specific deck (optional)"),
    limit: z.number().int().min(1).max(100).default(20).describe("Max cards to return"),
  },
  async ({ deck_id, limit }) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (deck_id) params.set("deck_id", deck_id);
    const data = await api("GET", `get-due-cards?${params}`);
    return { content: [{ type: "text", text: toText(data) }] };
  },
);

// ── review_card ────────────────────────────────────────────────────────────

server.tool(
  "review_card",
  "Submit a review result. Quality: 0=Blackout, 1=Wrong, 2=Wrong but familiar, 3=Hard, 4=Good, 5=Easy",
  {
    card_id: z.string().describe("The card ID"),
    quality: z.number().int().min(0).max(5).describe("Review quality 0-5"),
  },
  async (params) => {
    const data = await api("POST", "review-card", params);
    return { content: [{ type: "text", text: toText(data) }] };
  },
);

// ── delete_card ────────────────────────────────────────────────────────────

server.tool(
  "delete_card",
  "Delete a flashcard",
  { card_id: z.string().describe("The card ID to delete") },
  async (params) => {
    const data = await api("DELETE", "delete-card", params);
    return { content: [{ type: "text", text: toText(data) }] };
  },
);

// ── get_stats ──────────────────────────────────────────────────────────────

server.tool(
  "get_stats",
  "Get flashcard statistics",
  {
    deck_id: z.string().optional().describe("Filter to a specific deck (optional)"),
  },
  async ({ deck_id }) => {
    const params = new URLSearchParams();
    if (deck_id) params.set("deck_id", deck_id);
    const query = params.toString();
    const data = await api("GET", `get-stats${query ? `?${query}` : ""}`);
    return { content: [{ type: "text", text: toText(data) }] };
  },
);

// ── start ──────────────────────────────────────────────────────────────────

(async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
