const favoriteSellerModel = (sequelize, DataTypes) => {
    const favoriteSeller = sequelize.define('favoriteSeller', {
        u_id: DataTypes.INTEGER,
        seller_id: DataTypes.INTEGER
    })
    return favoriteSeller
}
export default favoriteSellerModel
