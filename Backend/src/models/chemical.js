const chemicalModel = (sequelize, DataTypes) => {
    const Chemical = sequelize.define('chemical', {
        title: DataTypes.STRING
    })
    return Chemical
}
export default chemicalModel
