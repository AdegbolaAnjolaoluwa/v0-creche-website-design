import { db } from "@/lib/db";
import { attendance, pupils, classes } from "@/lib/schema";
import { eq, and, sql, desc, gte, lte } from "drizzle-orm";

export type AttendanceFilters = {
    classId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
};

export async function getAttendanceRecords(filters: AttendanceFilters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    // Default to last 30 days if no dates provided
    let startDate = filters.startDate;
    let endDate = filters.endDate;

    if (!startDate || !endDate) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        
        endDate = end.toISOString().split('T')[0];
        startDate = start.toISOString().split('T')[0];
    }

    const whereConditions = [
        gte(attendance.date, startDate),
        lte(attendance.date, endDate!)
    ];

    if (filters.classId) {
        whereConditions.push(eq(attendance.classId, filters.classId));
    }

    // 1. Fetch Paginated Records
    const records = await db.select({
        id: attendance.id,
        date: attendance.date,
        studentName: pupils.name,
        className: classes.name,
        status: attendance.status,
        markedBy: attendance.markedBy
    })
    .from(attendance)
    .leftJoin(pupils, eq(attendance.studentId, pupils.id))
    .leftJoin(classes, eq(attendance.classId, classes.id))
    .where(and(...whereConditions))
    .orderBy(desc(attendance.date))
    .limit(limit)
    .offset(offset);

    // 2. Fetch Total Count (for pagination)
    const totalResult = await db.select({ count: sql<number>`count(*)` })
        .from(attendance)
        .where(and(...whereConditions));
    
    const total = totalResult[0]?.count || 0;

    return {
        data: records,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}
