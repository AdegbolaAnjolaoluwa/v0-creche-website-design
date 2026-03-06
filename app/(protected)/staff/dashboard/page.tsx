import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getStaffDashboardData } from "@/lib/server/staff-dashboard"
import StaffDashboardUI from "./StaffDashboardUI"

export default async function StaffDashboard() {
  const { userId, sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as any)?.role
  
  if (!userId || (role !== "org:staff" && role !== "org:admin")) {
    redirect("/login?type=staff")
  }

  // We need to get the user's email and classId.
  // In a real app, these should be in sessionClaims or fetched from a user profile table.
  // For now, we'll assume they are in metadata as per the original client component logic.
  // BUT, auth() doesn't expose all user data.
  // Optimization: We should ideally fetch the user profile from our DB using the Clerk ID.
  
  // Let's assume we can get email from sessionClaims if configured in Clerk, or we have to fetch the user.
  // Since we want to avoid external API calls to Clerk in every request if possible, 
  // but we need the email for the query.
  
  // Workaround for this refactor without changing Clerk config:
  // We will pass the userId to the client component, and let the client component handle the "fetching" 
  // IF we can't get data server side.
  // BUT, the goal is "Fetch DB data directly inside page.tsx".
  
  // Let's assume we have a way to map userId -> email in our DB (users table).
  // If not, we might need to fetch it.
  
  // For this specific codebase state, the `users` table exists. Let's try to query it.
  // import { db } from "@/lib/db"; import { users } from "@/lib/schema"; ...
  
  // However, for simplicity and to match the prompt's speed, 
  // we will render the UI skeleton and let the specific data fetching happen 
  // via a Server Action or we can try to fetch if we had the email.
  
  // Wait, the previous client code used `user.primaryEmailAddress?.emailAddress`.
  // Server-side `currentUser()` from Clerk can get this.
  
  const { currentUser } = await import("@clerk/nextjs/server")
  const user = await currentUser()
  
  if (!user) redirect("/login")
      
  const email = user.emailAddresses[0]?.emailAddress
  const classId = (user.publicMetadata.classId as string) || "Nursery 2" // Default fallback

  if (!email) redirect("/login")
  
  const data = await getStaffDashboardData(email, classId)

  return <StaffDashboardUI initialData={data} classId={classId} />
}
