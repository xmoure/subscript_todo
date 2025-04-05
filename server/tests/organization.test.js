const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


require('dotenv').config({ path: '.env.test' });

const db = require('../database/connection.js');
const { post } = require('./util/httpRequests.js');

describe('Organizations API (unauthenticated)', () => {
    afterAll(async () => {
        await db.destroy();
    });

    test('should create an organization', async () => {
        const res = await post('/organizations')
            .send({
                name: 'Test Organization'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('Test Organization');
    });

    test('should not create organization without a name', async () => {
        const res = await post('/organizations')
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});

