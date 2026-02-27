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

    // Create the invitation
    const invitation = await client.organizations.createOrganizationInvitation({
      organizationId: orgId,
      emailAddress: email,
      role: role, // e.g., 'org:staff' or 'org:parent'
      redirectUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://bayhood.vercel.app',
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
