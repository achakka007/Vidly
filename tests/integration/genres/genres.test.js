const {Genre} = require('../../../models/genre');
const {User} = require('../../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

// replace api with vidly
describe('/vidly/genres', () => {
    beforeEach(() => { server = require('../../../index');});
    afterEach(async() => {
        await server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async() => {
            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ]);

            const res = await request(server).get('/vidly/genres')
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if given a valid id', async() => {
            const genre = new Genre({name: 'genre1'});
            await genre.save();

            const res = await request(server).get('/vidly/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should throw 404 if not given a valid id', async() => {
            const res = await request(server).get('/vidly/genres/1');
            expect(res.status).toBe(404);
        });

        it('should throw 404 if not given a valid genre', async() => {
            const id = new mongoose.Types.ObjectId()
            const res = await request(server).get('/vidly/genres/' + id);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let token;
        let name;
        const exec = function() {
            return request(server)
                 .post('/vidly/genres')
                 .set('x-auth-token', token)
                 .send({name}); // key and value are same
        }

        beforeEach(() => {
            token = new User({isAdmin: true}).generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if client is not logged in', async() => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async() => {
            name = '1234';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save a genre if it is valid', async() => {
            await exec();

            const genre = await Genre.find({name: 'genre1'});
            expect(genre).not.toBeNull();
        });

        it('should return a genre if it is valid', async() => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /:id', () => {
        let token;
        let name;
        let id;
        const exec = function() {
            return request(server)
                 .put('/vidly/genres/' + id)
                 .set('x-auth-token', token)
                 .send({name});
        }

        beforeEach(async() => {
            const genre = new Genre({name:'genre1'});
            await genre.save();

            token = new User({isAdmin: true}).generateAuthToken();
            name = 'genre2';
            id = genre._id;
        });

        it('should return 401 if client is not logged in', async() => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async() => {
            name = '1234';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should throw 404 if not given a valid id', async() => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should throw 404 if not given a stored id', async() => {
            id = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

         it('should save a genre if it is valid', async() => {
            await exec();

            const g = await Genre.findById(id);
            expect(g).not.toBeNull();
            expect(g.name).toBe(name);
         });

         it('should return a genre if it is valid', async() => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
         });
        
    });

    describe('DELETE /:id', () => {
        let token;
        let id;
        const exec = function() {
            return request(server)
                 .delete('/vidly/genres/' + id)
                 .set('x-auth-token', token)
                 .send()
        }

        beforeEach(async() => {
            const genre = new Genre({name:'genre1'});
            await genre.save();

            token = new User({isAdmin: true}).generateAuthToken();
            id = genre._id;
        });

        it('should return 401 if client is not logged in', async() => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if the user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken(); 
      
            const res = await exec();
      
            expect(res.status).toBe(403);
        });

        it('should return 404 if id is invalid', async() => {
            id = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should throw 404 if not given a stored id', async() => {
            id = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should delete the genre if input is valid', async () => {
            await exec();
      
            const genreInDb = await Genre.findById(id);
      
            expect(genreInDb).toBeNull();
        });

        it('should return a genre if it is valid', async() => {
            const res = await exec();

            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

});