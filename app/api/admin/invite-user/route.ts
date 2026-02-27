import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId, orgId } = await auth()
    
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await req.json()
    const { email, role } = body

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
    }
    
    const client = await clerkClient()

    let user;
    try {
        const userList = await client.users.getUserList({ emailAddress: [email] });
        if (userList.data.length > 0) {
            user = userList.data[0];
        }
    } catch (e) {
        console.log("Error checking user existence", e)
    }

    // Pre-create user if not exists
    if (!user) {
        try {
            console.log(`Creating new user for ${email}...`)
            const newUser = await client.users.createUser({
                emailAddress: [email],
                skipPasswordRequirement: true,
                publicMetadata: {
                    role: role // 'org:admin' | 'org:staff' | 'org:parent'
                }
            });
            user = newUser; // Assign to outer variable
        } catch (e: any) {
             console.error("Failed to create user automatically:", e)
             return NextResponse.json({ error: e.errors?.[0]?.message || "Failed to create user" }, { status: 500 })
        }
    } else {
        // Update existing user role
        await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
                role: role
            }
        })
    }

    // Still add to organization for compatibility, but mark as "basic_member" or similar if needed
    // Actually, we can just skip the invitation entirely if we rely on metadata!
    // But to be safe and use Clerk's UI, we can still add them.
    // However, the user said "dont want them to have to join".
    // So let's DIRECTLY add them to the organization if possible.
    
    try {
        await client.organizations.createOrganizationMembership({
            organizationId: orgId,
            userId: user.id,
            role: role === 'org:admin' ? 'org:admin' : 'org:member' 
            // Note: Clerk roles are limited to admin/member unless custom. 
            // We map our 'org:staff' / 'org:parent' to 'org:member' + metadata
        })
    } catch (e) {
        // If already member, ignore
        console.log("User already in org or failed to add", e)
    }

    // We don't need to return an invitation object anymore since we didn't create one.
    // We just return success.
    return NextResponse.json({ success: true, message: "User created and added to organization." })
  } catch (error: any) {
    console.error('Error inviting user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to invite user' },
      { status: 500 }
    )
  }
}
