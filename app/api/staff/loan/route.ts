import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loanRequests } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const records = await db.select()
        .from(loanRequests)
        .where(eq(loanRequests.staffEmail, email))
        .orderBy(desc(loanRequests.createdAt));

    return NextResponse.json(records);

  } catch (error) {
    console.error("Error fetching staff loans:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, amount, reason, repaymentPlan } = body;

        if (!email || !amount || !reason) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newRecord = {
            id: nanoid(),
            staffId: email, // Using email as ID for now since we don't have separate staff table IDs readily available in this context
            staffEmail: email,
            staffName: email, // Fallback
            amount: parseInt(amount),
            reason,
            repaymentPlan,
            status: "Pending",
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        await db.insert(loanRequests).values(newRecord);

        return NextResponse.json({ success: true, record: newRecord });

    } catch (error) {
        console.error("Error creating loan request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
