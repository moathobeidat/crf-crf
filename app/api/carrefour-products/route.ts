import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), "data", "carrefour-products.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading product data:", error);
    return NextResponse.json({ error: "Failed to load product data" }, { status: 500 });
  }
}
