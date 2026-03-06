import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loanRequests } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

// GET /api/admin/loans
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real app, you'd check for admin role here.
    // const user = await clerkClient.users.getUser(userId);
    // if (user.publicMetadata.role !== 'org:admin') ...

    const allLoans = await db.select().from(loanRequests).orderBy(desc(loanRequests.createdAt));
    return NextResponse.json(allLoans);
  } catch (error) {
    console.error("Failed to fetch loans:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/admin/loans
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status, adminComment } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.update(loanRequests)
      .set({ 
        status, 
        approvedBy: userId, // or admin name
        // we might want to add an adminComment field to schema if not exists
        updatedAt: Date.now() 
      })
      .where(eq(loanRequests.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update loan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
