const hideEventModel = (sequelize, DataTypes) => {
    const hideEvent = sequelize.define('hideEvent', {
        event_id: DataTypes.INTEGER,
        u_id: DataTypes.INTEGER
    })
    return hideEvent
}
export default hideEventModel
