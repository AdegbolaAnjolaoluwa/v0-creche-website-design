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

    // 1. Check if the user already exists in the instance
    let user;
    try {
        const userList = await client.users.getUserList({ emailAddress: [email] });
        if (userList.data.length > 0) {
            user = userList.data[0];
        }
    } catch (e) {
        console.log("Error checking user existence", e)
    }

    // 2. We rely on the invitation flow.
    // When the user clicks the link, they will be taken to the Sign Up page to create their account and password.
    // Once they sign up, they will automatically be added to the organization and appear in the Clerk Dashboard.

    // Create the invitation
    const invitation = await client.organizations.createOrganizationInvitation({
      organizationId: orgId,
      emailAddress: email,
      role: role, 
      inviterUserId: userId, // Track who invited them
      redirectUrl: (process.env.NEXT_PUBLIC_APP_URL || 'https://bayhood.vercel.app') + '/sign-up', 
      // Point to our new custom sign-up page
    })

    return NextResponse.json({ invitation })
  } catch (error: any) {
    console.error('Error inviting user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to invite user' },
      { status: 500 }
    )
  }
}
