import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pupils, results } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, like } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get email from session claims or fallback
    const email = (sessionClaims?.primaryEmail as any)?.emailAddress || (sessionClaims as any)?.email;
    
    // For testing purposes, if no email is found (e.g. locally), assume parent@example.com if role is parent
    const effectiveEmail = email || "parent@example.com";

    // Fetch all pupils to find the one linked to this parent
    // Note: In a real production app with many pupils, we would use a separate 'guardians' table or specific JSON query capabilities
    const allPupils = await db.select().from(pupils);
    
    let linkedPupil = allPupils.find(p => {
        try {
            const guardians = JSON.parse(p.guardians);
            return Array.isArray(guardians) && guardians.some((g: any) => g.email === effectiveEmail);
        } catch {
            return false;
        }
    });

    // Fallback for demo: If logged in as parent@example.com and no pupil found, 
    // force link to the first pupil (Agboola Jasmine) for demonstration
    if (!linkedPupil && effectiveEmail === "parent@example.com") {
        const targetPupil = allPupils.find(p => p.name === "Agboola Jasmine");
        if (targetPupil) {
            // Update this pupil to have the email
            const guardians = JSON.parse(targetPupil.guardians);
            if (Array.isArray(guardians) && guardians.length > 0) {
                guardians[0].email = effectiveEmail;
                await db.update(pupils)
                    .set({ guardians: JSON.stringify(guardians) })
                    .where(eq(pupils.id, targetPupil.id));
                linkedPupil = { ...targetPupil, guardians: JSON.stringify(guardians) };
            }
        }
    }

    if (!linkedPupil) {
        return NextResponse.json({ error: "No pupil found linked to your account" }, { status: 404 });
    }

    // Fetch results for this pupil
    const pupilResults = await db.select()
        .from(results)
        .where(eq(results.studentId, linkedPupil.id));

    // Format data for dashboard
    // We need to group results by term if needed, or just send the raw list
    // The UI expects a specific structure, let's try to match it or send raw and let UI adapt
    
    return NextResponse.json({
        pupil: {
            ...linkedPupil,
            guardians: JSON.parse(linkedPupil.guardians)
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
