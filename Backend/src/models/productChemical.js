const productChemicalModel = (sequelize, DataTypes) => {
    const productChemical = sequelize.define('productChemical', {
        product_id: DataTypes.INTEGER,
        chemical_id: DataTypes.INTEGER
    })
    return productChemical
}
export default productChemicalModel
