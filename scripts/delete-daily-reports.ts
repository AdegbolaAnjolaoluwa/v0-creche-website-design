import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../lib/schema'; // Use relative path
import * as dotenv from 'dotenv';
import { dailyReports } from '../lib/schema'; // Use relative path

// Load environment variables
dotenv.config({ path: '.env.local' });

async function deleteDailyReports() {
  console.log('Deleting all daily reports...');

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error('TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not defined');
  }

  const client = createClient({ 
    url, 
    authToken 
  });

  const db = drizzle(client, { schema });

  try {
    await db.delete(dailyReports);
    console.log('All daily reports deleted successfully!');
  } catch (error) {
    console.error('Error deleting daily reports:', error);
  }
}

deleteDailyReports();
