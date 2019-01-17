export default (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    femalePopulation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    malePopulation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalPopulation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
  return Location;
};
