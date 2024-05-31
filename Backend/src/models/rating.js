const ratingModel = (sequelize, DataTypes) => {
    const rating = sequelize.define('rating', {
        u_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
        rating: DataTypes.FLOAT,
        seller: DataTypes.INTEGER
    })
    return rating
}
export default ratingModel
