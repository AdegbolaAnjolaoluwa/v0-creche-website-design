import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { results } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { resultsData } from "@/lib/data";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const term = searchParams.get("term");

    // Check if results table is empty
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(results);
    const count = countResult[0].count;

    if (count === 0) {
      console.log("Seeding results database...");
      const resultsToInsert = resultsData.map(r => ({
        id: r.id,
        studentId: r.pupilId || nanoid(),
        studentName: r.pupilName,
        classId: r.class, // Map class name to classId for now
        term: r.term,
        academicYear: "2023/2024",
        subjects: JSON.stringify(r.scores || {}),
        totalScore: r.finalScore || 0,
        averageScore: r.averageScore,
        grade: r.grade,
        teacherComment: r.teacherComment,
        headTeacherComment: r.proprietressComment,
        status: r.status,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));
      
      if (resultsToInsert.length > 0) {
        await db.insert(results).values(resultsToInsert);
      }
    }

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
      studentId: body.studentId,
      studentName: body.studentName,
      classId: body.classId,
      term: body.term,
      academicYear: body.academicYear,
      subjects: JSON.stringify(body.subjects),
      totalScore: body.totalScore,
      averageScore: body.averageScore,
      grade: body.grade,
      teacherComment: body.teacherComment,
      headTeacherComment: body.headTeacherComment,
      status: body.status,
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
