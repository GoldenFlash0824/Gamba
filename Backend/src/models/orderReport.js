const orderReportModel = (sequelize, DataTypes) => {
    const addReport = sequelize.define('orderReport', {
        //user id and order id comes from relation
        reason: DataTypes.STRING
    })
    return addReport
}
export default orderReportModel
