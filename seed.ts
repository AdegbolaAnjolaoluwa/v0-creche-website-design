import { pupilsData } from './lib/data';
import { db } from './lib/db';
import * as schema from './lib/schema';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function seed() {
  console.log('Seeding database...');

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error('Database credentials missing');
  }

  const client = createClient({ url, authToken });
  const db = drizzle(client, { schema });

  try {
    // Insert pupils
    console.log(`Inserting ${pupilsData.length} pupils...`);
    
    for (const pupil of pupilsData) {
      await db.insert(schema.pupils).values({
        id: pupil.id,
        name: pupil.name,
        classId: pupil.class,
        gender: pupil.gender,
        dateOfBirth: pupil.dateOfBirth,
        guardians: JSON.stringify(pupil.guardians),
        enrollmentDate: pupil.enrollmentDate,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).onConflictDoUpdate({
        target: schema.pupils.id,
        set: {
            name: pupil.name,
            classId: pupil.class,
            gender: pupil.gender,
            dateOfBirth: pupil.dateOfBirth,
            guardians: JSON.stringify(pupil.guardians),
            enrollmentDate: pupil.enrollmentDate,
            updatedAt: Date.now(),
        }
      });
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();
