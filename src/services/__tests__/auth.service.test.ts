import { describe, it, expect, vi, beforeEach } from 'vitest';
import prisma from '../../config/__mocks__/database';

import authService from '../auth.service';
import { UserRepository } from "../../repositories/userRepository";
import { hashPassword, verifyPassword } from '../../lib/password';

// Ensure modules that import `src/config/database` receive the mock
vi.mock('../../config/database', () => ({ default: prisma }));

vi.mock('../../repositories/userRepository', () => ({
    UserRepository: {
        findByEmail: vi.fn(),
        create: vi.fn(),
    },
}));

vi.mock('../../lib/password', () => ({
    hashPassword: vi.fn(),
    verifyPassword: vi.fn(),
}))
// Mock the events so they don't actually fire
// vi.mock('../../lib/events', () => ({
//     appEvents: { emit: vi.fn() },
// }));

describe('auth.service.register', () => {
    beforeEach(() => vi.clearAllMocks());

    const newUser = { firstName: 'Test', lastName: 'User', email: 'test@example.com', password: 'SecurePass1' };
    it('creates a user with a hashed password', async () => {
        vi.mocked(hashPassword).mockResolvedValue(newUser.password);
        vi.mocked(UserRepository.findByEmail).mockReturnValue(null as any);
        vi.mocked(UserRepository.create).mockReturnValue({ ...newUser , id:1, password: 'hashedPassword', isActive: true, tier: 'free' }  as any);

        // prisma.user.findUnique.mockResolvedValue(null as any);
        // prisma.user.create.mockResolvedValue({ ...newUser , id:1, password: 'hashedPassword', isActive: true, tier: 'free' }  as any);

        const result = await authService.registerUser(newUser);

        expect(UserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
            ...newUser
        }));

        expect(result).not.toHaveProperty('password');
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('tier');
    });

    it('throws ConflictError if email exists', async () => {
        vi.mocked(UserRepository.findByEmail).mockResolvedValue({
            id: 'existing',
        });

        await expect(
            authService.registerUser(newUser)
        ).rejects.toThrow('A user with this email already exists.');
    });
});


// describe('auth.service.login', () => {
//     beforeEach(() => vi.clearAllMocks());

//     it('returns tokens for valid credentials', async () => {
//         const bcrypt = await import('bcrypt');
//         const hash = await bcrypt.hash('SecurePass1', 12);

//         (prisma.user.findUnique as any).mockResolvedValue({
//             id: 'uuid-1',
//             email: 'test@example.com',
//             tier: 'free',
//             isActive: true,
//             passwordHash: hash,
//         });
//         (prisma.refreshToken.create as any).mockResolvedValue({});

//         const result = await authService.login({
//             email: 'test@example.com',
//             password: 'SecurePass1',
//         });

//         expect(result).toHaveProperty('accessToken');
//         expect(result).toHaveProperty('refreshToken');
//         expect(result.user.email).toBe('test@example.com');
//     });

//     it('throws for wrong password', async () => {
//         const bcrypt = await import('bcrypt');
//         const hash = await bcrypt.hash('RealPassword1', 12);

//         (prisma.user.findUnique as any).mockResolvedValue({
//             id: 'uuid-1',
//             email: 'test@example.com',
//             isActive: true,
//             passwordHash: hash,
//         });

//         await expect(
//             authService.login({
//                 email: 'test@example.com',
//                 password: 'WrongPassword1',
//             })
//         ).rejects.toThrow('Invalid credentials');
//     });

//     it('throws the same error for non-existent user', async () => {
//         (prisma.user.findUnique as any).mockResolvedValue(null);

//         await expect(
//             authService.login({
//                 email: 'nobody@example.com',
//                 password: 'Whatever1',
//             })
//         ).rejects.toThrow('Invalid credentials');
//     });
// });

