const userNotificationModel = (sequelize, DataTypes) => {
    const userNotification = sequelize.define('userNotifications', {
        u_id: DataTypes.STRING,
        like_my_post: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
        comment_my_post: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
        bookmark_my_post: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
        someone_follow: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
        share_my_post: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true}
    })
    return userNotification
}
export default userNotificationModel
