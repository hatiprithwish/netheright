import { sdiService } from "@/features/interview/server/sdi.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { sessionId, graph } = await req.json();

  if (!sessionId || !graph) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const analysis = await sdiService.analyzeDesign(BigInt(sessionId), graph);
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Analysis failed:", error);
    return NextResponse.json(
      { error: "Failed to analyze design" },
      { status: 500 },
    );
  }
}
