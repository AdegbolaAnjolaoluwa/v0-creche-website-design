import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pupils, pupilIdSequence } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { hashPassword } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    let query = db.select().from(pupils);
    
    if (classId) {
      // @ts-ignore
      query = query.where(eq(pupils.classId, classId));
    }

    const allPupils = await query;
    return NextResponse.json(allPupils);
  } catch (error) {
    console.error("Error fetching pupils:", error);
    return NextResponse.json({ error: "Failed to fetch pupils" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    // Ideally check if user is admin or staff with permission
    const role = (sessionClaims?.metadata as any)?.role;
    
    if (!userId || (role !== 'org:admin' && role !== 'org:staff')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, classId, gender, dateOfBirth, guardians, enrollmentDate } = body;

    if (!name || !classId || !gender || !dateOfBirth || !enrollmentDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Auto-generate Pupil ID (BPS-XXX)
    // 1. Get next sequence value
    const sequence = await db.select().from(pupilIdSequence).where(eq(pupilIdSequence.id, 1));
    let nextVal = 1;

    if (sequence.length === 0) {
      await db.insert(pupilIdSequence).values({ id: 1, currentValue: 1 });
    } else {
      nextVal = sequence[0].currentValue + 1;
      await db.update(pupilIdSequence).set({ currentValue: nextVal }).where(eq(pupilIdSequence.id, 1));
    }

    const pupilId = `BPS-${nextVal.toString().padStart(3, '0')}`;
    const defaultPassword = hashPassword(pupilId);

    const newPupil = {
      id: pupilId,
      name,
      classId,
      gender,
      dateOfBirth,
      guardians: JSON.stringify(guardians || []),
      enrollmentDate,
      parentPassword: defaultPassword,
      isFirstLogin: true,
      portalAccess: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.insert(pupils).values(newPupil);

    return NextResponse.json({ success: true, pupil: newPupil });
  } catch (error) {
    console.error("Error creating pupil:", error);
    return NextResponse.json({ error: "Failed to create pupil" }, { status: 500 });
  }
}
