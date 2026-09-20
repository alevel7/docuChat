// tests/integration/auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { resetDatabase, createTestUser } from '../helpers/setup';
import { StatusCodes } from 'http-status-codes';

describe('POST /api/auth/register', () => {
    beforeEach(async () => {
        await resetDatabase();
    });

    it('creates a user and returns 201', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'new@example.com',
                password: 'SecurePass1',
                firstName: 'New',
                lastName: 'User',
            });
        expect(res.status).toBe(201);
        expect(res.body.data.tier).toBe('free');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.email).toBe('new@example.com');
        // // Password hash must not be in the response
        expect(res.body.data).not.toHaveProperty('password');
    });

    it('returns 400 for invalid email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'not-an-email', password: 'SecurePass1' });

        expect(res.status).toBe(400);
        expect(res.body.errors?.length).greaterThan(0)
        // expect(res.body.error.details).toEqual(
        //     expect.arrayContaining([
        //         expect.objectContaining({ field: 'email' }),
        //     ])
        // );
    });

    it('returns 409 for duplicate email', async () => {
        await createTestUser({ email: 'taken@example.com' });

        const res = await request(app)
            .post('/api/auth/register')
            .send({ 
                email: 'taken@example.com', 
                password: 'SecurePass1',
                firstName: 'Test',
                lastName: 'Doe' 
            });

        expect(res.status).toBe(StatusCodes.CONFLICT);
    });
});


describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        await resetDatabase();
        await createTestUser({ email: 'user@example.com' });
    });

    it('returns tokens for valid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@example.com', password: 'TestPassword1!' });

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data).toHaveProperty('refreshToken');
    });

    it('returns 401 for wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@example.com', password: 'WrongPassword1' });

        expect(res.status).toBe(401);
        // console.log(res.body)
        expect(res.body.error).toBe('Invalid credentials');
    });

    it('returns 404 for non-existent email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'nobody@example.com', password: 'Whatever1' });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Invalid credentials');
    });
});


// describe('Protected routes', () => {
//     let accessToken: string;

//     beforeEach(async () => {
//         await resetDatabase();
//         await createTestUser({ email: 'user@example.com' });

//         const login = await request(app)
//             .post('/api/v1/auth/login')
//             .send({ email: 'user@example.com', password: 'TestPassword1!' });
//         accessToken = login.body.accessToken;
//     });

//     it('returns 401 without a token', async () => {
//         const res = await request(app).get('/api/v1/documents');
//         expect(res.status).toBe(401);
//     });

//     it('returns 200 with a valid token', async () => {
//         const res = await request(app)
//             .get('/api/v1/documents')
//             .set('Authorization', `Bearer ${accessToken}`);
//         expect(res.status).toBe(200);
//     });
// });

