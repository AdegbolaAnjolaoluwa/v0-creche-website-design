import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, pupils, results, parentPupil } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { verifyParentToken } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    let pupilId = "";

    // 1. Check for Secure Parent Session Cookie (Priority)
    const cookie = req.cookies.get("parent_session");
    
    if (cookie) {
        const payload = await verifyParentToken(cookie.value);
        if (payload && payload.pupilId) {
            pupilId = payload.pupilId;
        } else {
             // Invalid token, but maybe they are using email flow?
             // Let's not block yet, but note it.
        }
    }

    // 2. Fallback to Email Link (Clerk) if no cookie or cookie failed
    if (!pupilId && email) {
        // Standard access via Email Link
        // Check if linked
        const links = await db.select().from(parentPupil).where(eq(parentPupil.parentEmail, email));
        
        if (links.length === 0) {
            return NextResponse.json({ notLinked: true });
        }
        pupilId = links[0].pupilId;
    } 
    
    if (!pupilId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Fetch Pupil Details
    const pupilData = await db.select().from(pupils).where(eq(pupils.id, pupilId));
    
    if (pupilData.length === 0) {
         return NextResponse.json({ error: "Pupil not found" }, { status: 404 });
    }

    // 4. Fetch Results
    const pupilResults = await db.select().from(results).where(eq(results.studentId, pupilId));

    return NextResponse.json({
        pupil: pupilData[0],
        results: pupilResults
    });

  } catch (error) {
    console.error("Error fetching parent dashboard:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, pupilId } = body;

        if (!email || !pupilId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify pupil exists
        const pupilCheck = await db.select().from(pupils).where(eq(pupils.id, pupilId));
        if (pupilCheck.length === 0) {
            return NextResponse.json({ error: "Invalid Pupil ID" }, { status: 404 });
        }

        // Create Link
        // Check if already exists
        const existing = await db.select()
            .from(parentPupil)
            .where(and(eq(parentPupil.parentEmail, email), eq(parentPupil.pupilId, pupilId)));
            
        if (existing.length > 0) {
             return NextResponse.json({ message: "Already linked" });
        }

        await db.insert(parentPupil).values({
            id: nanoid(),
            parentEmail: email,
            pupilId: pupilId,
            createdAt: Date.now()
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error linking parent to pupil:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
