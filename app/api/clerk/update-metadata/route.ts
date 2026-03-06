import { type NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    // 1. Security Check: Only admins should be able to update metadata
    // This is a simplified check. In production, check for a specific 'admin' role or permission.
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const body = await req.json();
    const { parentUserId, studentId } = body;

    if (!parentUserId || !studentId) {
      return NextResponse.json(
        { error: "Missing required fields: parentUserId, studentId" },
        { status: 400 }
      );
    }

    // 3. Update the organization membership metadata
    const client = await clerkClient();
    const organizationId = "org_3ADp2as8HPPEnFUOBvgUqkGX8GR"; // Using the provided Organization ID

    await client.organizations.updateOrganizationMembershipMetadata({
      organizationId,
      userId: parentUserId,
      publicMetadata: {
        studentId: studentId,
      },
    });

    return NextResponse.json({ success: true, message: "Metadata updated successfully" });
  } catch (error) {
    console.error("Error updating metadata:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
