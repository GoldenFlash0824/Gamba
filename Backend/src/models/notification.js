const notificationModel = (sequelize, DataTypes) => {
    const notification = sequelize.define('notification', {
        u_id: DataTypes.INTEGER,
        post_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
        event_id: DataTypes.INTEGER,
        type: DataTypes.STRING,
        f_id: DataTypes.INTEGER,
        message: DataTypes.STRING,
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
    return notification
}

export default notificationModel
