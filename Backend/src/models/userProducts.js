const userProductsModel = (sequelize, DataTypes) => {
    const userProductGood = sequelize.define('userProductGood', {
        name: DataTypes.STRING,
        category_id: DataTypes.INTEGER,
        price: DataTypes.INTEGER,
        is_donation: DataTypes.BOOLEAN,
        is_trade: DataTypes.BOOLEAN,
        u_id: DataTypes.INTEGER,
        images: {
            type: DataTypes.JSON,
            get() {
                return typeof this.getDataValue('images') == 'string' ? JSON.parse(this.getDataValue('images')) : this.getDataValue('images')
            }
        },
        quantity: DataTypes.INTEGER,
        is_organic: DataTypes.BOOLEAN,
        discount: DataTypes.INTEGER,
        chemical_id: DataTypes.INTEGER,
        unit: DataTypes.STRING,
        is_block: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        available_from: DataTypes.STRING,
        available_to: DataTypes.STRING,
        allow_to_0rder: {
            type: DataTypes.STRING
        },
        allow_to_0rder_advance: {
            type: DataTypes.INTEGER
        },
        is_delivery: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_pickUp: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        advance_order_day: DataTypes.STRING,
        advance_order_in_weeks: DataTypes.STRING,
        distance: DataTypes.STRING,
        caption: DataTypes.TEXT,
        none: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        allow_per_person: DataTypes.INTEGER,
        isUnlimitted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
    return userProductGood
}
export default userProductsModel
