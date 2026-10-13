import { NextResponse } from "next/server";
import { exceptions } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const simulate = searchParams.get("simulate");

  if (simulate === "error") {
    return NextResponse.json({ message: "Simulated server error" }, { status: 500 });
  }

  if (simulate === "slow") {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  
  return NextResponse.json(exceptions);
}