const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateAdminEmail() {
    try {
        // Find and update admin user's email
        const admin = await prisma.user.updateMany({
            where: { username: 'admin' },
            data: {
                email: 'admin@gmail.com'
            }
        });

        if (admin.count > 0) {
            console.log('✓ Admin email updated successfully!');
            console.log('  Email: admin@gmail.com');
            console.log('  Password: admin123');
            console.log('\nYou can now login with:');
            console.log('  Email: admin@gmail.com');
            console.log('  Password: admin123');
        } else {
            console.log('No admin user found. Creating one...');
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('admin123', 10);

            await prisma.user.create({
                data: {
                    username: 'admin',
                    email: 'admin@gmail.com',
                    password_hash: hashedPassword
                }
            });

            console.log('✓ Admin user created!');
            console.log('  Email: admin@gmail.com');
            console.log('  Password: admin123');
        }
    } catch (error) {
        console.error('Error updating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAdminEmail();
