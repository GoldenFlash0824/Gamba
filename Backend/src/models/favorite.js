const favoritesModel = (sequelize, DataTypes) => {
    const favorite = sequelize.define('favorite', {
        u_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER
    })
    return favorite
}
export default favoritesModel
