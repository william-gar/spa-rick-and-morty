const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "character",
    {
      id: {
        type: DataTypes.UUID,
        default: Datatypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      species: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },

      origin: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      image: {
        type: Datatypes.STRING,
      },

      created: {
        type: DataTypes.STRING,
      },

      createdInDb: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
