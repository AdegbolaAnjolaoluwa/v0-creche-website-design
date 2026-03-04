import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pupils } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { signParentToken } from "@/lib/auth-utils";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Rate Limiter (Only if env vars are present, else skip or mock)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting
    if (ratelimit) {
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 });
      }
    }

    const body = await req.json();
    const { pupilId, password } = body;

    if (!pupilId || !password) {
      return NextResponse.json({ error: "Missing Credentials" }, { status: 400 });
    }

    // 2. Find Pupil
    const pupil = await db.select().from(pupils).where(eq(pupils.id, pupilId)).limit(1);

    if (pupil.length === 0) {
      // Return generic error to prevent enumeration
      return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    const foundPupil = pupil[0];

    // 3. Verify Password (Date of Birth)
    if (foundPupil.dateOfBirth !== password) {
         return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    // 4. Generate JWT
    const token = await signParentToken({ pupilId: foundPupil.id });

    // 5. Set Cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("parent_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 // 24 hours
    });
    
    return response;

  } catch (error) {
    console.error("Parent login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
