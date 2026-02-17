import ProblemsRepo from "@/backend/repositories/ProblemsRepo";
import { NextResponse } from "next/server";

export async function GET() {
  const response = await ProblemsRepo.getProblems();
  return NextResponse.json(response);
}
