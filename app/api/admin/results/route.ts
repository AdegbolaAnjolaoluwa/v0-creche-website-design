import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { results, auditLogs } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

const resultSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  classId: z.string(),
  term: z.string(),
  academicYear: z.string(),
  subjects: z.union([z.string(), z.record(z.any())]),
  totalScore: z.number(),
  averageScore: z.number(),
  grade: z.string(),
  teacherComment: z.string().optional(),
  headTeacherComment: z.string().optional(),
  status: z.enum(['Draft', 'Published']),
});

export async function GET(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role;

    if (!userId || (role !== 'org:admin' && role !== 'org:staff')) {
       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const term = searchParams.get("term");
    const requestedLimit = parseInt(searchParams.get("limit") || "50");
    // Hard cap limit at 100 to prevent DoS
    const limit = Math.max(1, Math.min(requestedLimit, 100)); 
    
    const requestedOffset = parseInt(searchParams.get("offset") || "0");
    // Hard cap offset to prevent deep pagination abuse (performance degradation)
    const offset = Math.max(0, Math.min(requestedOffset, 10000));

    let query = db.select().from(results);
    const conditions = [];

    if (classId) conditions.push(eq(results.classId, classId));
    if (term) conditions.push(eq(results.term, term));

    if (conditions.length > 0) {
        // @ts-ignore
        query.where(and(...conditions));
    }

    const allResults = await query.limit(limit).offset(offset);
    return NextResponse.json(allResults);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error("Error fetching results:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role;
    
    if (!userId || (role !== 'org:admin' && role !== 'org:staff')) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    
    const validation = resultSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json({ error: "Invalid payload", details: validation.error.flatten() }, { status: 400 });
    }

    const data = validation.data;
    
    const newResult = {
      id: nanoid(),
      studentId: data.studentId,
      studentName: data.studentName,
      classId: data.classId,
      term: data.term,
      academicYear: data.academicYear,
      subjects: typeof data.subjects === 'string' ? data.subjects : JSON.stringify(data.subjects),
      totalScore: data.totalScore,
      averageScore: data.averageScore,
      grade: data.grade,
      teacherComment: data.teacherComment,
      headTeacherComment: data.headTeacherComment,
      status: data.status,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Transactional write: Insert Result + Audit Log
    await db.transaction(async (tx) => {
        await tx.insert(results).values(newResult);

        // Audit Log
        await tx.insert(auditLogs).values({
            id: nanoid(),
            userId: userId,
            role: role,
            action: 'CREATE',
            entity: 'Result',
            details: JSON.stringify({ resultId: newResult.id, studentId: newResult.studentId }),
            timestamp: Date.now()
        });
    });

    return NextResponse.json({ success: true, result: newResult });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error("Error creating result:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
