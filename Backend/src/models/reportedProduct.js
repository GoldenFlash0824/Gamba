const reportedProductModel = (sequelize, DataTypes) => {
    const reportedProduct = sequelize.define('reportedProduct', {
        u_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
        reason: DataTypes.STRING
    })
    return reportedProduct
}
export default reportedProductModel
