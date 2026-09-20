import prisma from '../../src/config/database';

export async function resetDatabase() {
    // Delete in order that respects foreign key constraints
    // await prisma.usageLog.deleteMany();
    // await prisma.message.deleteMany();
    // await prisma.conversation.deleteMany();
    // await prisma.chunk.deleteMany();
    // await prisma.document.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
}

export async function createTestUser(overrides = {}) {
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash('TestPassword1!', 4); // Low rounds for speed
    return prisma.user.create({
        data: {
            email: 'test@docuchat.dev',
            password: hash,
            firstName: 'Test',
            lastName: 'User',
            tier: 'free',
            isActive: true,
            ...overrides,
        },
    });
}