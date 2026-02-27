import { clerkClient } from '@clerk/nextjs/server';
import { loadEnvConfig } from '@next/env';

// Load environment variables so we can use Clerk secret key locally
loadEnvConfig(process.cwd());

async function main() {
    console.log("Starting to fix Clerk users...");
    const client = await clerkClient();
    const users = await client.users.getUserList();

    for (const user of users.data) {
        const email = user.emailAddresses[0]?.emailAddress?.toLowerCase() || "";
        const role = (user.publicMetadata as any)?.role;
        console.log(`User: ${email}, Current Role: ${role}`);

        if (!role || email.includes('anjeeesax')) {
            let newRole = 'org:parent';
            if (email.includes('admin') || email.includes('anjeesax') || email.includes('anjeeesax')) {
                newRole = 'org:admin';
            } else if (email.includes('staff')) {
                newRole = 'org:staff';
            }

            console.log(`Assigning role ${newRole} for ${email}...`);
            await client.users.updateUserMetadata(user.id, {
                publicMetadata: { role: newRole }
            });
            console.log(`Updated successfully.`);
        }
    }
    console.log("Done.");
}

main().catch(console.error);
