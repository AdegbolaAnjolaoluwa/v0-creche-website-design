import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../lib/schema';
import * as dotenv from 'dotenv';
import { dailyReports } from '../lib/schema';

dotenv.config({ path: '.env.local' });

async function checkDailyReports() {
  const url = process.env.TURSO_DATABASE_URL!;
  const authToken = process.env.TURSO_AUTH_TOKEN!;
  const client = createClient({ url, authToken });
  const db = drizzle(client, { schema });

  const reports = await db.select().from(dailyReports);
  console.log(`Daily Reports count: ${reports.length}`);
}

checkDailyReports();
