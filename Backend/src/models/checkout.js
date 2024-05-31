const checkoutModel = (sequelize, DataTypes) => {
    const checkout = sequelize.define('checkout', {
        u_id: {
            type: DataTypes.INTEGER
        },
        seller_id: {
            type: DataTypes.INTEGER
        },
        delivery_charges: {
            type: DataTypes.INTEGER
        },
        service_charges: {
            type: DataTypes.INTEGER
        },
        total: {
            type: DataTypes.INTEGER
        },
        payment_method: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        status: DataTypes.STRING,              
        status_date: {type: DataTypes.DATE, allowNull: true},        
        ref_id: {
            type: DataTypes.VIRTUAL,
            get() {
              const desiredLength = 7;
              const propertyString = String(this.id);
              return propertyString.length < desiredLength ? '0'.repeat(desiredLength - propertyString.length) + propertyString : propertyString;
            },
        },
    })
    return checkout
}
export default checkoutModel
