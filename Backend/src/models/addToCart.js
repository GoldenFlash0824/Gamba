const addToCartModel = (sequelize, DataTypes) => {
    const addToCart = sequelize.define('addToCart', {
        u_id: {type: DataTypes.INTEGER},
        product_id: {type: DataTypes.INTEGER},
        quantity: {type: DataTypes.INTEGER},
        price: {type: DataTypes.INTEGER}
        //
    })
    return addToCart
}
export default addToCartModel
