const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


require('dotenv').config({ path: '.env.test' });

const db = require('../database/connection.js');
const jwt = require('jsonwebtoken');
const { get, post } = require('./util/httpRequests.js');

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';


async function createTestUser(name, email, organization_id, password = 'test123') {
    const [user] = await db('users')
        .insert({ name, email, password, organization_id })
        .returning('*');
    return user;
}

async function createTestOrganization(name = 'Test Org') {
    const [org] = await db('organizations')
        .insert({ name })
        .returning('*');
    return org;
}


afterAll(async () => {
    await db.destroy();
});

describe('Users API (unauthenticated)', () => {
    let organization;

    beforeEach(async () => {
        // Reset all tables before each test
        await db.raw('TRUNCATE "taskAssignees", "projectMembers", "comments", "attachments", "tasks", "projects", "users", "organizations" RESTART IDENTITY CASCADE');

        organization = await createTestOrganization('Unauth Org');
    });

    test('should create a user', async () => {
        const res = await post('/users', {
            name: 'Test User',
            email: 'user@example.com',
            password: 'password123',
            organization_id: organization.id
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('Test User');
        expect(res.body.email).toBe('user@example.com');
    });

    test('should fail to create user with missing fields', async () => {
        const res = await post('/users', {
            email: 'incomplete@example.com'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('should fail to create user with duplicate email', async () => {
        await createTestUser('User One', 'userone@example.com', organization.id);

        const res = await post('/users', {
            name: 'User Two',
            email: 'userone@example.com',
            password: 'pass1234',
            organization_id: organization.id
        });

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('error');
    });
});

describe('Users API (authenticated)', () => {
    let user, token, organization;

    beforeEach(async () => {
        await db.raw('TRUNCATE "taskAssignees", "projectMembers", "comments", "attachments", "tasks", "projects", "users", "organizations" RESTART IDENTITY CASCADE');

        organization = await createTestOrganization('Auth Org');

        user = await createTestUser('Auth User', 'auth@example.com', organization.id, 'hashedpassword');

        token = jwt.sign(
            { id: user.id, organization_id: user.organization_id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        await createTestUser('User 2', 'user2@example.com', organization.id);
    });

    test('should return list of users', async () => {
        const res = await get('/users')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('email');
        expect(res.body[1]).toHaveProperty('name');
    });

    test('should return 401 if no token is provided', async () => {
        const res = await get('/users');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error');
    });
});
