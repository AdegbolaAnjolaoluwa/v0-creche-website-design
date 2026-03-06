import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pupils } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { verifyParentToken, hashPassword, signParentToken } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("parent_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyParentToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
    }

    const body = await req.json();
    const { newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const hashedPassword = hashPassword(newPassword);

    // Update password and set isFirstLogin to false
    await db.update(pupils)
      .set({ 
        parentPassword: hashedPassword,
        isFirstLogin: false,
        updatedAt: Date.now()
      })
      .where(eq(pupils.id, payload.pupilId));

    // Issue new token with isFirstLogin: false
    const newToken = await signParentToken({ 
      pupilId: payload.pupilId, 
      isFirstLogin: false 
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("parent_session", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
