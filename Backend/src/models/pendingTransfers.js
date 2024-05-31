import moment from "moment"

const pendingTransfersModel = (sequelize, DataTypes) => {
    const pendingTransfers = sequelize.define('pendingTransfers', {
        u_id: DataTypes.INTEGER,        
        order_id: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},        
        purchased_by_id: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        amount: {type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0.0},
        transfer_group: {type: DataTypes.STRING, allowNull: false, defaultValue: ''},        
        dateDeposite: {type: DataTypes.DATE, allowNull: false},        
        status: {type: DataTypes.STRING, allowNull: false, defaultValue: 'PENDING'},        
        remarks: {type: DataTypes.STRING, allowNull: false, defaultValue: ''},
        transaction_id: {type: DataTypes.STRING, allowNull: false, defaultValue: ''},
    })
    return pendingTransfers
}
export default pendingTransfersModel
