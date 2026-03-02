import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pupils, parentPupil } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

// This is a "Mock" login for Parents using Pupil ID
// In a real app, you'd want a more secure way (e.g. password set by admin, or date of birth verification)
// For now, we assume "Password" might be the Date of Birth or a specific code.
// Let's assume the "Password" field in the login form is checking against the Pupil's Date of Birth (YYYY-MM-DD) for verification.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pupilId, password } = body;

    if (!pupilId || !password) {
      return NextResponse.json({ error: "Missing Credentials" }, { status: 400 });
    }

    // 1. Find Pupil
    const pupil = await db.select().from(pupils).where(eq(pupils.id, pupilId)).limit(1);

    if (pupil.length === 0) {
      return NextResponse.json({ error: "Invalid Pupil ID" }, { status: 401 });
    }

    const foundPupil = pupil[0];

    // 2. Verify Password (using Date of Birth as password for simplicity/demo as requested)
    // In production, use a hashed password field in a 'parent_accounts' table.
    // Ensure the date format matches what the user types (e.g. YYYY-MM-DD)
    if (foundPupil.dateOfBirth !== password) {
         return NextResponse.json({ error: "Invalid Password (Use Date of Birth: YYYY-MM-DD)" }, { status: 401 });
    }

    // 3. Success
    // Since we aren't using Clerk for this specific "Pupil ID" flow in this custom route,
    // we simply return success. The frontend will redirect.
    // Note: This bypasses Clerk's session. The parent dashboard needs to handle "Unauthenticated" state 
    // by checking for a query param or a custom cookie if we went that route.
    // For now, we are just validating credentials.
    
    return NextResponse.json({ success: true, pupil: foundPupil });

  } catch (error) {
    console.error("Parent login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}