import express from 'express';
import {
  createLocation,
  getAllLocations,
  getSingleLocation,
  deleteLocation,
} from '../../controller/location';

const Router = express.Router();

Router.route('/')
  .get((req, res) => {
    res.status(200).send({
      message: 'Welcome to population Management API',
    });
  });

Router.route('/locations')
  .post(createLocation)
  .get(getAllLocations);

Router.route('/locations/:id')
  .get(getSingleLocation)
  .delete(deleteLocation);


export default Router;
