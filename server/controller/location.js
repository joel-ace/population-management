import { Location } from '../models';
import Validator from '../helpers/validator';
import { handleCatchError } from '../helpers/utils';

export const createLocation = async (req, res) => {
  const {
    name,
    malePopulation,
    femalePopulation,
    parentId
  } = req.body;

  const validator = new Validator();
  validator.isEmptyInput(name, 'name');
  validator.isEmptyInput(malePopulation, 'malePopulation');
  validator.inputIsNumber(malePopulation, 'malePopulation');
  validator.isEmptyInput(femalePopulation, 'femalePopulation');
  validator.inputIsNumber(femalePopulation, 'femalePopulation');

  if (parentId) {
    validator.inputIsNumber(parentId, 'parentId');
  }

  const errors = validator.validationErrors();

  if (errors) {
    return res.status(400).send({
      error: errors,
    });
  }

  try {
    let parentLocation = null;

    if (parentId) {
      parentLocation = await Location.findByPk(parentId);
    }

    if (parentId && !parentLocation) {
      return res.status(400).send({
        error: 'parentId does not belong to an existing location',
      });
    }

    const location = await Location.create({
      name,
      malePopulation,
      femalePopulation,
      parentId: parentId || null,
      totalPopulation: malePopulation + femalePopulation,
    });

    return res.status(201).send({
      location,
    });
  } catch (error) {
    return res.status(400).send({
      error: [error.message],
    });
  }
};

export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    return res.status(200).send({
      locations,
    });
  } catch (error) {
    return handleCatchError(res);
  }
};

export const getSingleLocation = async (req, res) => {
  const { id } = req.params;

  const validator = new Validator();
  validator.inputIsNumber(id, 'id');

  const errors = validator.validationErrors();

  if (errors) {
    return res.status(400).send({
      error: errors,
    });
  }

  try {
    const location = await Location.findByPk(id);

    if (!location) {
      return res.status(404).send({
        message: 'this location does not exist or has been previously deleted',
      });
    }

    return res.status(200).send({
      location,
    });
  } catch (error) {
    return handleCatchError(res);
  }
};

export const deleteLocation = async (req, res) => {
  const { id } = req.params;

  const validator = new Validator();
  validator.inputIsNumber(id, 'id');

  const errors = validator.validationErrors();

  if (errors) {
    return res.status(400).send({
      error: errors,
    });
  }

  try {
    const location = await Location.findByPk(id);

    if (!location) {
      return res.status(404).send({
        error: 'this location does not exist or has been previously deleted',
      });
    }

    const subLocations = await Location.findAll({ where: { parentId: location.id } });
    await subLocations.forEach((locationInstance) => {
      locationInstance.update({ parentId: null });
    });

    await location.destroy();

    return res.status(200).send({
      message: 'location has been successfully deleted',
    });
  } catch (error) {
    return handleCatchError(res);
  }
};
