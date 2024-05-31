const contectUsModel = (sequelize, DataTypes) => {
    const contectUs = sequelize.define('contectUs', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        subject: DataTypes.STRING,
        message: DataTypes.STRING
    })
    return contectUs
}
export default contectUsModel
