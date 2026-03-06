import { db } from "@/lib/db";
import { pupils, results, parentPupil } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function getParentDashboardData(identifier: { type: 'cookie' | 'email', value: string }) {
  const hasDbEnv = Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
  if (!hasDbEnv) {
    return null;
  }

  let pupilId = "";

  if (identifier.type === 'cookie') {
      // Value is pupilId from verified JWT
      pupilId = identifier.value;
  } else if (identifier.type === 'email') {
      // Value is email, look up link
      const links = await db.select().from(parentPupil).where(eq(parentPupil.parentEmail, identifier.value));
      if (links.length > 0) {
          pupilId = links[0].pupilId;
      } else {
          return { notLinked: true };
      }
  }

  if (!pupilId) {
      return null;
  }

  const pupilData = await db.select().from(pupils).where(eq(pupils.id, pupilId));
  
  if (pupilData.length === 0) {
       return null; 
  }

  const pupilResults = await db.select().from(results).where(eq(results.studentId, pupilId));

  return {
      pupil: pupilData[0],
      results: pupilResults
  };
}
