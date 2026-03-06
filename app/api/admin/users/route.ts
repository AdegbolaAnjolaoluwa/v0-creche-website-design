import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// GET: List all users
export async function GET(req: Request) {
  try {
    const { userId, orgId } = await auth()

    // Check if requester is authorized (should be admin)
    // Note: In real app, check metadata or org role for 'org:admin'
    // For now we assume if they are in the org context, they can list users if they are admin

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clerkClient()

    // Fetch users from Clerk
    // We can filter by query params if needed
    const users = await client.users.getUserList({
      limit: 100,
    })

    // Map to simplified structure
    const userList = users.data.map(u => ({
      id: u.id,
      email: u.emailAddresses[0]?.emailAddress,
      firstName: u.firstName,
      lastName: u.lastName,
      role: (u.publicMetadata as any)?.role || 'org:parent', // Default to parent if no role
      createdAt: u.createdAt,
      lastSignInAt: u.lastSignInAt
    }))

    return NextResponse.json({ users: userList })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a user
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Parse body
    const { searchParams } = new URL(req.url)
    const targetUserId = searchParams.get('id')

    if (!targetUserId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const client = await clerkClient()

    // Prevent deleting yourself
    if (targetUserId === userId) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    }

    await client.users.deleteUser(targetUserId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}

// PATCH: Update user role
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const targetUserId = body.userId
    const newRole = body.role
    const newClassId = body.classId

    if (!targetUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const client = await clerkClient()
    
    // Prepare metadata update
    const metadata: Record<string, any> = {}
    if (newRole) metadata.role = newRole
    if (newClassId !== undefined) metadata.classId = newClassId

    // Update user metadata
    if (Object.keys(metadata).length > 0) {
      await client.users.updateUserMetadata(targetUserId, {
        publicMetadata: metadata
      })
    }

    return NextResponse.json({ success: true, message: 'User updated successfully' })
  } catch (error: any) {
    console.error('Error updating role:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update user role' },
      { status: 500 }
    )
  }
}
