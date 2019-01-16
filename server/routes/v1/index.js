import express from 'express';

const Router = express.Router();

Router.route('/')
  .get((req, res) => {
    res.status(200).send({
      message: 'Welcome to population Management API',
    });
  });

Router.route('/locations').get((req, res) => {
  res.status(200).send({
    locations: 'Welcome',
  });
});

export default Router;
