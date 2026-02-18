import { auth } from "@/lib/next-auth";
import DashboardRepo from "@/backend/repositories/DashboardRepo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { isSuccess: false, message: "Unauthorized", interviews: [] },
        { status: 401 },
      );
    }

    const result = await DashboardRepo.getInterviewHistory(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in dashboard interviews API:", error);
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Internal server error",
        interviews: [],
      },
      { status: 500 },
    );
  }
}
