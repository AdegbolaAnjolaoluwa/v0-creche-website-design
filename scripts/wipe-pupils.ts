import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../lib/schema';
import * as dotenv from 'dotenv';
import { pupils, results, attendance, parentPupil, parentStudentLinks, dailyReports } from '../lib/schema';
import { sql } from 'drizzle-orm';

dotenv.config({ path: '.env.local' });

async function wipePupils() {
  console.log('Wiping all pupil-related data...');

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
    // Delete in order of dependency (child tables first)
    console.log('Deleting results...');
    await db.delete(results);
    
    console.log('Deleting attendance...');
    await db.delete(attendance);

    console.log('Deleting daily reports...');
    await db.delete(dailyReports);
    
    console.log('Deleting parent links...');
    await db.delete(parentPupil);
    await db.delete(parentStudentLinks);

    console.log('Deleting pupils...');
    await db.delete(pupils);
    
    // Reset any sequences if we had them (we'll create one shortly)
    // For now just wiping data
    
    console.log('All pupil data wiped successfully!');
  } catch (error) {
    console.error('Error wiping data:', error);
  }
}

wipePupils();
