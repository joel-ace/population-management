import request from 'supertest';
import app from '../../../app';
import { Location } from '../../models';
import testData from '../testData';

describe('Location', async () => {
  const nanId = 'hkjkj';
  const notExistId = 300;
  const maxOutId = 5000000000000000; // to cause a sequelize error

  beforeAll(async (done) => {
    await Location.create(testData[0]);
    await Location.create(testData[1]);
    await Location.create(testData[2]);
    await Location.create(testData[3]);
    done();
  });

  afterAll(() => {
    Location.close();
  });

  describe('/POST requests', () => {
    it('should return a locations object if successful', async () => {
      const location = {
        name: 'Shomolu',
        malePopulation: 20,
        femalePopulation: 30,
        parentId: 2
      };
      expect.assertions(8);
      const response = await request(app).post('/api/v1/locations')
        .send(location);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty(['location']);
      expect(response.body.location.id).toBe(5);
      expect(response.body.location.name).toBe('Shomolu');
      expect(response.body.location.malePopulation).toBe(20);
      expect(response.body.location.femalePopulation).toBe(30);
      expect(response.body.location.parentId).toBe(2);
      expect(response.body.location.totalPopulation).toBe(50);
    });

    it('should return an error array if the request inputs are empty', async () => {
      const location = {
        name: 'Shomolu',
        malePopulation: '',
        femalePopulation: 'ygubh',
      };
      expect.assertions(4);
      const response = await request(app).post('/api/v1/locations')
        .send(location);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(['error']);
      expect(response.body.error).toContain('malePopulation cannot be empty');
      expect(response.body.error).toContain('femalePopulation must be a number');
    });

    it('should return an error array if the parentId does not belong to an existing location', async () => {
      const location = {
        name: 'Shomolu',
        malePopulation: 20,
        femalePopulation: 30,
        parentId: 200
      };
      expect.assertions(3);
      const response = await request(app).post('/api/v1/locations')
        .send(location);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(['error']);
      expect(response.body.error).toContain('parentId does not belong to an existing location');
    });
  });

  describe('/GET requests', () => {
    it('should return an array of locations if successful', async () => {
      expect.assertions(5);
      const response = await request(app).get('/api/v1/locations');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(['locations']);
      expect(response.body.locations.length).toBe(5);
      expect(response.body.locations[0].name).toBe('Shomolu');
      expect(response.body.locations[0].totalPopulation).toBe(1810);
    });
    it('should return a 400 status if no id is sent in the request', async () => {
      expect.assertions(3);
      const response = await request(app).get(`/api/v1/locations/${nanId}`);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(['error']);
      expect(response.body.error[0]).toBe('id must be a number');
    });

    it('should return an internal server error message if there is a sequelize error', async () => {
      expect.assertions(3);
      const response = await request(app).get(`/api/v1/locations/${maxOutId}`);
      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty(['message']);
      expect(response.body.message).toBe('We encountered an error. Please try again later');
    });

    it('should return a 404 status if location id requested does not exist', async () => {
      expect.assertions(3);
      const response = await request(app).get(`/api/v1/locations/${notExistId}`);
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty(['message']);
      expect(response.body.message).toBe('this location does not exist or has been previously deleted');
    });

    it('should return a location object when requested using an id', async () => {
      const locationId = 2;
      expect.assertions(8);
      const response = await request(app).get(`/api/v1/locations/${locationId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(['location']);
      expect(response.body.location.id).toBe(locationId);
      expect(response.body.location.name).toBe('Bariga');
      expect(response.body.location.femalePopulation).toBe(310);
      expect(response.body.location.malePopulation).toBe(260);
      expect(response.body.location.totalPopulation).toBe(570);
      expect(response.body.location.parentId).toBe(1);
    });
  });

  describe('/PUT requests', () => {
    it('should return an error array if the request inputs are empty', async () => {
      const location = {
        name: 'Shomolu',
        malePopulation: '',
        femalePopulation: 'ygubh',
      };
      expect.assertions(4);
      const response = await request(app).put('/api/v1/locations/3')
        .send(location);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(['error']);
      expect(response.body.error).toContain('malePopulation cannot be empty');
      expect(response.body.error).toContain('femalePopulation must be a number');
    });

    it('should return an error array if the parentId does not belong to an existing location', async () => {
      const location = {
        name: 'Shomolu',
        malePopulation: 20,
        femalePopulation: 30,
        parentId: 200
      };
      expect.assertions(3);
      const response = await request(app).put('/api/v1/locations/3')
        .send(location);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(['error']);
      expect(response.body.error).toContain('parentId does not belong to an existing location');
    });

    it('should return a 404 status if location id requested does not exist', async () => {
      const location = {
        name: 'Shomolu',
        malePopulation: 20,
        femalePopulation: 30,
        parentId: 2
      };
      expect.assertions(3);
      const response = await request(app).put(`/api/v1/locations/${notExistId}`)
        .send(location);
      expect(response.statusCode).toEqual(404);
      expect(response.body).toHaveProperty(['error']);
      expect(response.body.error).toBe('this location does not exist or has been previously deleted');
    });

    it('should display an internal server error message if there is a sequelize error', async () => {
      const location = {
        name: 'Shomolu',
        malePopulation: 20,
        femalePopulation: 30,
        parentId: 2
      };
      expect.assertions(3);
      const response = await request(app).put(`/api/v1/locations/${maxOutId}`)
        .send(location);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toHaveProperty(['message']);
      expect(response.body.message).toBe('We encountered an error. Please try again later');
    });

    it('should update a location successfuly and return a location object', async () => {
      const location = {
        name: 'Yaba',
        malePopulation: 1000,
        femalePopulation: 1500,
        parentId: 4
      };
      expect.assertions(8);
      const response = await request(app).put('/api/v1/locations/3')
        .send(location);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(['location']);
      expect(response.body.location.id).toBe(3);
      expect(response.body.location.name).toBe('Yaba');
      expect(response.body.location.malePopulation).toBe(1000);
      expect(response.body.location.femalePopulation).toBe(1500);
      expect(response.body.location.parentId).toBe(4);
      expect(response.body.location.totalPopulation).toBe(2500);
    });
  });

  describe('/DELETE requests', () => {
    it('should return a 400 status if no id is sent in the request', async () => {
      expect.assertions(3);
      const response = await request(app).delete(`/api/v1/locations/${nanId}`);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toHaveProperty(['error']);
      expect(response.body.error[0]).toBe('id must be a number');
    });

    it('should return a 404 status if location id requested does not exist', async () => {
      expect.assertions(3);
      const response = await request(app).delete(`/api/v1/locations/${notExistId}`);
      expect(response.statusCode).toEqual(404);
      expect(response.body).toHaveProperty(['error']);
      expect(response.body.error).toBe('this location does not exist or has been previously deleted');
    });

    it('should display an internal server error message if there is a sequelize error', async () => {
      expect.assertions(3);
      const response = await request(app).delete(`/api/v1/locations/${maxOutId}`);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toHaveProperty(['message']);
      expect(response.body.message).toBe('We encountered an error. Please try again later');
    });

    it('should delete a location when requested with an id', async () => {
      const locationId = 1;
      expect.assertions(3);
      const response = await request(app).delete(`/api/v1/locations/${locationId}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty(['message']);
      expect(response.body.message).toBe('location has been successfully deleted');
    });
  });
});
