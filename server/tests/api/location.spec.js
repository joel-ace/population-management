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
      expect(response.statusCode).toEqual(201);
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
      expect(response.statusCode).toEqual(400);
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
      expect(response.statusCode).toEqual(400);
      expect(response.body).toHaveProperty(['error']);
      expect(response.body.error).toContain('parentId does not belong to an existing location');
    });
  });
});
