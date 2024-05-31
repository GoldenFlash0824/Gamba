const paymentHistoryModel = (sequelize, DataTypes) => {
    const paymentHistory = sequelize.define('paymentHistory', {
        date_paid: {type: DataTypes.DATE, allowNull: true},
        checkout_id: DataTypes.INTEGER,
        total: DataTypes.DOUBLE,
        amount_paid_to_gamba: DataTypes.DOUBLE,
        confirmation_no: DataTypes.STRING,
        status: DataTypes.STRING
    })
    return paymentHistory
}
export default paymentHistoryModel
