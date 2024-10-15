import * as db from '../db/mongodb.mjs';
import * as auth from '../db/auth.mjs';

beforeAll(async () => {
    await db.connect();
});

afterAll(async () => {
    await db.close();
});

let userId;

// Test CreateUser
describe('MongoDB Test', () => {

    it('should test that createUser returns a string or throws "User already exists"', async () => {

        try {
            userId = await auth.createUser('testuser', 'test@example.com', 'password');
            expect(typeof userId).toBe('string');
        } catch (error) {
            expect(error.message).toBe('User already exists');
        }
    })

    it('should test that createUser with invalid email fails', async () => {
        expect(async () => {
            await auth.createUser('testuser', 'test@.com', 'password')
        }).rejects.toThrow('Invalid email address');
    })

    it('should test that createUser with empty username or password failes', async () => {
        expect(
            auth.createUser('testuser', 'test@example.com', '')
        ).rejects.toThrow('Username and password are required');
    })
    expect(
        auth.createUser('', 'test@example.com', 'password')
    ).rejects.toThrow('Username and password are required');
})


// Test sendEmail
describe('Send Email Test', () => {

    it('should test that sendEmail works', async () => {
        
        expect(await auth.sendEmail('maru23@student.bth.se','Test Subject', 'Test Content new')).toBeUndefined();
    });
})