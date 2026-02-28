import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { results } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const term = searchParams.get("term");

    let query = db.select().from(results);
    
    // Build dynamic query
    if (classId && term) {
        // @ts-ignore
        query = query.where(and(eq(results.classId, classId), eq(results.term, term)));
    } else if (classId) {
        // @ts-ignore
        query = query.where(eq(results.classId, classId));
    }

    const allResults = await query;
    return NextResponse.json(allResults);
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role;
    
    if (!userId || (role !== 'org:admin' && role !== 'org:staff')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    // Validate body...
    
    const newResult = {
      id: nanoid(),
      ...body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.insert(results).values(newResult);

    return NextResponse.json({ success: true, result: newResult });
  } catch (error) {
    console.error("Error creating result:", error);
    return NextResponse.json({ error: "Failed to create result" }, { status: 500 });
  }
}
