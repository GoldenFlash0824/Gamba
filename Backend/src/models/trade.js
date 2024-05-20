const tradesModel = (sequelize, DataTypes) => {
    const userTrades = sequelize.define('userTrades', {
        product_id: DataTypes.INTEGER,
        title: DataTypes.JSON,
        quantity: DataTypes.INTEGER,
        unit: DataTypes.STRING,
        image: DataTypes.STRING
    })
    return userTrades
}
export default tradesModel
