const joinEventModel = (sequelize, DataTypes) => {
    const joinEvent = sequelize.define('joinEvent', {
        event_id: DataTypes.INTEGER,
        u_id: DataTypes.INTEGER,
        payment_id: DataTypes.INTEGER
    })
    return joinEvent
}
export default joinEventModel
