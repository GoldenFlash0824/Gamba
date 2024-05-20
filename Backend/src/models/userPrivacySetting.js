const userPrivacySettingModel = (sequelize, DataTypes) => {
    const userPrivacysetting = sequelize.define('userPrivacysetting', {
        display_phone: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        display_email: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        display_dob: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        display_location: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
    return userPrivacysetting
}
export default userPrivacySettingModel
