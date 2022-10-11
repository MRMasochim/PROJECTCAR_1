module.exports = ( sequelize, DataTypes ) => {
    const Car = sequelize.define('Car', {
        brand: DataTypes.STRING,
        gen: DataTypes.STRING,
        thumbnail: DataTypes.STRING,
        pictures: DataTypes.STRING,
        content: DataTypes.TEXT,
        engine: DataTypes.STRING,
       power: DataTypes.STRING,
    })
    return Car
}