import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress?.toLowerCase() || ""

    // Self-Healing Logic:
    // If user's email looks like an Admin, forcefully assign org:admin role
    if (email.includes("admin") || email.includes("anjeesax")) {
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'org:admin'
            }
        })
        return NextResponse.json({ success: true, message: "Fixed admin role", role: "org:admin" })
    } 
    // If user's email looks like Staff
    else if (email.includes("staff")) {
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'org:staff'
            }
        })
        return NextResponse.json({ success: true, message: "Fixed staff role", role: "org:staff" })
    }
    // If user's email looks like Parent
    else if (email.includes("parent")) {
         await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'org:parent'
            }
        })
        return NextResponse.json({ success: true, message: "Fixed parent role", role: "org:parent" })
    }
    // Default fallback to Parent if unknown
    else {
         await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'org:parent' // Safe default
            }
        })
        return NextResponse.json({ success: true, message: "Fixed default parent role", role: "org:parent" })
    }

  } catch (error: any) {
    console.error('Error fixing role:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fix role' },
      { status: 500 }
    )
  }
}
