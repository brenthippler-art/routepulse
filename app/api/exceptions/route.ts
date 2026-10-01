import { NextResponse } from "next/server";
import { exceptions } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get("simulate") === "error") {
    return NextResponse.json({ message: "Simulated server error" }, { status: 500 });
  }

  await new Promise((resolve) => setTimeout(resolve, 600));
  return NextResponse.json(exceptions);
}