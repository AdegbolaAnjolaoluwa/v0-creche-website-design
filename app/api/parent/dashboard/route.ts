import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pupils, results, parentStudentLinks } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// GET: Fetch dashboard data (pupil, results) for linked child
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Check for linked pupil
    const link = await db.select().from(parentStudentLinks).where(eq(parentStudentLinks.userId, userId));
    
    if (link.length === 0) {
      return NextResponse.json({ notLinked: true });
    }

    const studentId = link[0].studentId;
    
    // 2. Fetch Pupil Data
    const pupilList = await db.select().from(pupils).where(eq(pupils.id, studentId));
    if (pupilList.length === 0) {
       // Should ideally delete broken link, but for now just return error
       return NextResponse.json({ error: "Linked pupil not found" }, { status: 404 });
    }
    const pupil = pupilList[0];

    // 3. Fetch Results
    const pupilResults = await db.select()
        .from(results)
        .where(eq(results.studentId, studentId))
        .orderBy(results.createdAt); // Order by date created

    return NextResponse.json({
        pupil: {
            ...pupil,
            guardians: JSON.parse(pupil.guardians)
        },
        results: pupilResults.map(r => ({
            ...r,
            subjects: JSON.parse(r.subjects)
        }))
    });

  } catch (error) {
    console.error("Error fetching parent dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Link a pupil to the parent account using Pupil ID
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { pupilId } = body;

        if (!pupilId) {
            return NextResponse.json({ error: "Pupil ID is required" }, { status: 400 });
        }

        // 1. Verify Pupil Exists
        const existingPupil = await db.select().from(pupils).where(eq(pupils.id, pupilId));
        if (existingPupil.length === 0) {
            return NextResponse.json({ error: "Pupil ID not found. Please check and try again." }, { status: 404 });
        }

        // 2. Create Link
        // Check if link already exists
        const existingLink = await db.select().from(parentStudentLinks).where(eq(parentStudentLinks.userId, userId));
        if (existingLink.length > 0) {
            // Update existing link or reject? Let's update for now to allow switching/correction
            await db.update(parentStudentLinks)
                .set({ studentId: pupilId })
                .where(eq(parentStudentLinks.userId, userId));
        } else {
            await db.insert(parentStudentLinks).values({
                id: nanoid(),
                userId,
                studentId: pupilId,
                createdAt: Date.now()
            });
        }

        return NextResponse.json({ success: true, message: "Successfully linked to pupil" });

    } catch (error) {
        console.error("Error linking pupil:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
