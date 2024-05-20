const ordersModel = (sequelize, DataTypes) => {
    const userSoldProductGood = sequelize.define('soldProducts', {
        product_id: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        c_id: DataTypes.INTEGER,
        seller_id: DataTypes.INTEGER,
        total: DataTypes.INTEGER,
        charge_gamba: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        payment_method: {
            type: DataTypes.STRING,
            defaultValue: ''
        }
        //payment id
        //status
    })
    return userSoldProductGood
}
export default ordersModel
