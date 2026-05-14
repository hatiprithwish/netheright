import { NextRequest } from "next/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import McpKeyDAL from "@/backend/data-access-layer/McpKeyDAL";
import FlashcardDAL from "@/backend/data-access-layer/FlashcardDAL";
import FlashcardRepo from "@/backend/repositories/FlashcardRepo";

function toText(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

async function getUserId(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  const headerKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const urlKey = req.nextUrl.searchParams.get("key");
  const rawKey = headerKey ?? urlKey;
  if (!rawKey) return null;
  return McpKeyDAL.verifyKey(rawKey);
}

function buildServer(userId: string): McpServer {
  const server = new McpServer({ name: "flashcards", version: "1.0.0" });

  server.tool("list_decks", "List all flashcard decks with card counts and due counts", {}, async () => {
    const data = await FlashcardDAL.getDecks(userId);
    return { content: [{ type: "text", text: toText(data) }] };
  });

  server.tool(
    "create_deck",
    "Create a new flashcard deck",
    {
      name: z.string().min(1).max(100).describe("Deck name"),
      description: z.string().max(500).optional().describe("Optional deck description"),
    },
    async ({ name, description }) => {
      const data = await FlashcardDAL.createDeck({ userId, name, description });
      return { content: [{ type: "text", text: toText(data) }] };
    },
  );

  server.tool(
    "add_card",
    "Add a single flashcard to a deck",
    {
      deck_id: z.string().describe("The deck ID"),
      front: z.string().min(1).describe("Question / front of card"),
      back: z.string().min(1).describe("Answer / back of card"),
      tags: z.array(z.string()).optional().describe("Optional tags"),
    },
    async ({ deck_id, front, back, tags }) => {
      const data = await FlashcardDAL.createCard({ deckId: deck_id, front, back, tags });
      return { content: [{ type: "text", text: toText(data) }] };
    },
  );

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
    async ({ deck_id, cards }) => {
      const data = await FlashcardDAL.bulkCreateCards({ deckId: deck_id, cards });
      return { content: [{ type: "text", text: toText(data) }] };
    },
  );

  server.tool(
    "get_due_cards",
    "Get flashcards due for review today (SM-2 spaced repetition)",
    {
      deck_id: z.string().optional().describe("Filter to a specific deck (optional)"),
      limit: z.number().int().min(1).max(100).default(20).describe("Max cards to return"),
    },
    async ({ deck_id, limit }) => {
      const data = await FlashcardDAL.getDueCards({ userId, deckId: deck_id, limit });
      return { content: [{ type: "text", text: toText(data) }] };
    },
  );

  server.tool(
    "review_card",
    "Submit a review result. Quality: 0=Blackout, 1=Wrong, 2=Wrong but familiar, 3=Hard, 4=Good, 5=Easy",
    {
      card_id: z.string().describe("The card ID"),
      quality: z.number().int().min(0).max(5).describe("Review quality 0-5"),
    },
    async ({ card_id, quality }) => {
      const data = await FlashcardRepo.submitReview({ cardId: card_id, userId, quality });
      return { content: [{ type: "text", text: toText(data) }] };
    },
  );

  server.tool(
    "delete_card",
    "Delete a flashcard",
    { card_id: z.string().describe("The card ID to delete") },
    async ({ card_id }) => {
      const data = await FlashcardDAL.deleteCard(card_id);
      return { content: [{ type: "text", text: toText(data) }] };
    },
  );

  server.tool(
    "get_stats",
    "Get flashcard statistics",
    { deck_id: z.string().optional().describe("Filter to a specific deck (optional)") },
    async ({ deck_id }) => {
      const data = await FlashcardDAL.getStats(userId, deck_id);
      return { content: [{ type: "text", text: toText(data) }] };
    },
  );

  return server;
}

async function handle(req: NextRequest): Promise<Response> {
  const userId = await getUserId(req);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  const server = buildServer(userId);
  await server.connect(transport);
  return transport.handleRequest(req);
}

export const POST = handle;
export const GET = handle;
export const DELETE = handle;
