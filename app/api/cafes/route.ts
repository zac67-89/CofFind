import { NextResponse } from "next/server";
import cafes from "@/data/cafes.json";

export async function GET() {
  try {
    return NextResponse.json(cafes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load cafes data" }, { status: 500 });
  }
}
