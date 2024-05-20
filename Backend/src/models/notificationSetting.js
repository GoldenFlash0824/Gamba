const notificationSettingModel = (sequelize, DataTypes) => {
    const notificationSetting = sequelize.define('notificationSetting', {
        email_notification: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        sms_notification: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        recieve_msg: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        promotional_offers: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        two_fector_auth: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        u_id: DataTypes.INTEGER
    })
    return notificationSetting
}

export default notificationSettingModel
