const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        // Check if admin already exists
        const existingAdmin = await prisma.user.findFirst({
            where: { username: 'admin' }
        });

        if (existingAdmin) {
            console.log('✓ Admin user already exists');
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.user.create({
            data: {
                username: 'admin',
                email: 'admin@gmail.com',
                password_hash: hashedPassword
            }
        });

        console.log('✓ Admin user created successfully!');
        console.log('  Email: admin@gmail.com');
        console.log('  Password: admin123');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
