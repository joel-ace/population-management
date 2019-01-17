import { Op } from 'sequelize';
import { Location } from '../models';

export const handleCatchError = res => res.status(500).send({
  message: 'We encountered an error. Please try again later',
});

export const getLocationAncestors = async (location) => {
  const { id } = location;
  const parentLocation = await Location.findByPk(id, {
    attributes: ['parentId'],
  });

  const { parentId } = parentLocation;
  const ancestors = parentId ? `${parentId},${id}` : `${id}`;

  return ancestors;
};

export const updateAncestorPopulation = async (ancestorIds, malePopulation, femalePopulation) => {
  const idArray = ancestorIds.split(',');

  const ancestors = await Location.findAll({
    where: {
      id: {
        [Op.or]: idArray
      }
    }
  });

  ancestors.forEach((location) => {
    location.update({
      malePopulation: (malePopulation + location.malePopulation),
      femalePopulation: (femalePopulation + location.femalePopulation),
      totalPopulation: (malePopulation + femalePopulation + location.totalPopulation)
    });
  });
};

export const getDirectParentId = (ids) => {
  const parentIdArray = ids && ids.split(',');
  const directParentId = ids && Math.max(...parentIdArray);
  return directParentId;
};
