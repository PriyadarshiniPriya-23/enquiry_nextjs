const { PrismaClient } = require('../src/generated/prisma/client.ts');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const hrPassword = await bcrypt.hash('Hr@123', 10);
    const counsellorPassword = await bcrypt.hash('Counsellor@123', 10);
    const accountsPassword = await bcrypt.hash('Accounts@123', 10);

    // Create users
    const users = [
        {
            email: 'admin@gmail.com',
            password: adminPassword,
            role: 'ADMIN'
        },
        {
            email: 'hr@gmail.com',
            password: hrPassword,
            role: 'HR'
        },
        {
            email: 'counsellor@gmail.com',
            password: counsellorPassword,
            role: 'COUNSELLOR'
        },
        {
            email: 'accounts@gmail.com',
            password: accountsPassword,
            role: 'ACCOUNTS'
        }
    ];

    // Insert users (upsert to avoid duplicates)
    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {
                password: user.password,
                role: user.role
            },
            create: user
        });
        console.log(`✅ Created/Updated user: ${user.email} (${user.role})`);
    }

    console.log('🎉 Database seeding completed!');
    console.log('\n📝 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ADMIN:      admin@gmail.com / Admin@123');
    console.log('HR:         hr@gmail.com / Hr@123');
    console.log('COUNSELLOR: counsellor@gmail.com / Counsellor@123');
    console.log('ACCOUNTS:   accounts@gmail.com / Accounts@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
