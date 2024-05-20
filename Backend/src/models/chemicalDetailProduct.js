const chemicalDetailProductModel = (sequelize, DataTypes) => {
    const ChemicalDetail = sequelize.define('ChemicalDetailProduct', {
        chemical_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER
    })
    return ChemicalDetail
}
export default chemicalDetailProductModel
