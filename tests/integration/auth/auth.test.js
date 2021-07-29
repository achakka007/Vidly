const {Genre} = require('../../../models/genre');
const {User} = require('../../../models/user');
const request = require('supertest');
let server;

describe('auth middleware', () => {

    let token;
    const exec =  function() {
        return request(server)
                 .post('/vidly/genres')
                 .set('x-auth-token', token)
                 .send({name: 'genre1'}); // key and value are same
    }

    beforeEach(() => {
        server = require('../../../index');
        token = new User().generateAuthToken();
    });
    afterEach(async() => {
        await Genre.remove({});
        await server.close();
    });

    it('should return 401 if no token is provided', async() => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if invalid token is provided', async() => {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if valid token is provided', async() => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});