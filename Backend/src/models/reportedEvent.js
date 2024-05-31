const reportedEventModel = (sequelize, DataTypes) => {
    const reportedEvent = sequelize.define('reportedEvent', {
        u_id: DataTypes.INTEGER,
        event_id: DataTypes.INTEGER,
        reason: DataTypes.STRING
    })
    return reportedEvent
}
export default reportedEventModel
