const fcmNotificationModel = (sequelize, DataTypes) => {
    const fcmNotification = sequelize.define('fcmNotifications', {
        u_id: DataTypes.STRING,
        f_id: DataTypes.STRING,
        message: DataTypes.STRING,
        type: DataTypes.STRING
    })
    return fcmNotification
}

export default fcmNotificationModel
