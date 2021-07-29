const moment = require('moment');
const request = require('supertest');
const {Movie} = require('../../../models/movie');
const {Rental} = require('../../../models/rental');
const {User} = require('../../../models/user');
let server;

describe('/vidly/returns', () => {
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    exec = function() {
        return request(server)
            .post('/vidly/returns')
            .set('x-auth-token', token)
            .send({movieId, customerId})
    }

    beforeEach(async () => {
        server = require('../../../index');
        movie = new Movie({
            title: '12345',
            dailyRentalRate: 2,
            genre: {name: '12345'},
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                name: '12345',
                phone: '12345'
            },
            movie: movie
        });
        await rental.save();

        customerId = rental.customer._id;
        movieId = rental.movie._id;
        token = new User({isAdmin: true}).generateAuthToken();
    });
    afterEach(async() => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    it('should return 401 if client is not logged in', async() => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async() => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async() => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for movieId/customerId', async() => {
        await Rental.remove({});
        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if rental is already processed', async() => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if request is valid', async() => {
        const res = await exec();
        expect(res.status).toBe(200);
    });

    it('should return the rental if request is valid', async() => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee',
            'customer', 'movie']));
    });

    it('should set return date if input is valid', async() => {
        await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should set rental fee if input is valid', async() => {
        await exec();
        const movieInDb = await Movie.findById(movie._id);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });
});