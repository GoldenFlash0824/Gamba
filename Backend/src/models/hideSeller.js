const hideSellerModel = (sequelize, DataTypes) => {
    const hideSeller = sequelize.define('hideSeller', {
        seller_id: DataTypes.INTEGER,
        u_id: DataTypes.INTEGER
    })
    return hideSeller
}
export default hideSellerModel
