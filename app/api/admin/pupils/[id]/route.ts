import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pupils } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const pupil = await db.select().from(pupils).where(eq(pupils.id, id)).limit(1);

    if (pupil.length === 0) {
      return NextResponse.json({ error: "Pupil not found" }, { status: 404 });
    }

    return NextResponse.json(pupil[0]);
  } catch (error) {
    console.error("Error fetching pupil:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role;
    
    if (!userId || (role !== 'org:admin' && role !== 'org:staff')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    
    // Allow updating portal access and reason
    // Also other fields if needed, but primarily focusing on access control here
    const updateData: any = {};
    
    if (typeof body.portalAccess !== 'undefined') updateData.portalAccess = body.portalAccess;
    if (typeof body.accessBlockReason !== 'undefined') updateData.accessBlockReason = body.accessBlockReason;
    if (body.name) updateData.name = body.name;
    if (body.classId) updateData.classId = body.classId;
    if (body.guardians) updateData.guardians = JSON.stringify(body.guardians);

    updateData.updatedAt = Date.now();

    await db.update(pupils)
      .set(updateData)
      .where(eq(pupils.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating pupil:", error);
    return NextResponse.json({ error: "Failed to update pupil" }, { status: 500 });
  }
}
