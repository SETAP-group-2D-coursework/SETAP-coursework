

    let chai, expect, supertest, request, app;

    async function init() {
        chai = await import('chai');
        expect = chai.expect;
        supertest = require('supertest');
        app = require('../server');
        request = supertest(app);
    }

    describe('User Routes', () => {
        before(async () => {
            await init();
        });

    describe('GET api/users/:id', () => {

        it('should return the user if the id exists', async () => {
            const res = await request.get('/api/users/2');
            console.log('Response body: ', res.body);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            if (res.body.length > 0) {
                expect(res.body[0]).to.have.property('user_id').that.is.a('number');
                expect(res.body[0]).to.have.property('user_username').that.is.a('string');
                expect(res.body[0]).to.have.property('user_email').that.is.a('string');
            } else {
                expect.fail('No use found for id: 2')
            }
            
        });

        it('should return 400 when user id does not exist', async () => {
            const res = await request.get('/api/users/unknown');
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('message', 'User not found');
        });

    });
});

describe('POST /api/users', () => {
    it('should create a user with valid input', async () => {
        const newUser = {
            username: 'janedoe',
            email: 'jane@example.com',
            password: 'jane123'
        };
        const res = await request
            .post('/api/users')
            .send(newUser);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message').that.includes('User added');
    });

    it('should log in a user with valid credentials', async () => {
        const credentials = {
            username: 'elliesmith',
            password: 'helloworld345'
        };
        const res = await request
            .post('/api/login')
            .send(credentials)
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message').that.includes('Welcome back');
        expect(res.header['set-cookie']).to.exist;
    });

    it('should return 401 for invalid credentials', async () => {
        const res = await request
            .post('/api/login')
            .send({ username: 'elliesmith', password: 'wrong'});
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message', 'Invalid credentials. Try again');
    });

    it('should return 400 for missing password', async () => {
        const res = await request
            .post('/api/users')
            .send({ username: 'elliesmith' });
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message', 'username, email, and password are required');
    });

});


