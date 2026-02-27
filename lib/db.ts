import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '@/lib/schema';

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

// Only check for env vars in production or if not building
// This prevents build errors if env vars are missing in CI
if (!url && process.env.NODE_ENV !== 'production') {
    console.warn('TURSO_DATABASE_URL is not defined, database operations will fail');
}

const client = createClient({ 
    url: url || 'libsql://dummy-url', 
    authToken: authToken || 'dummy-token' 
});

export const db = drizzle(client, { schema });
