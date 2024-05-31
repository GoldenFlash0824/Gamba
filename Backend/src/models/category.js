const categoryModel = (sequelize, DataTypes) => {
    const productCategorys = sequelize.define('categories', {
        title: DataTypes.STRING,
        disabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
    return productCategorys
}
export default categoryModel
