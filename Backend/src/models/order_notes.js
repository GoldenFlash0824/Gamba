const orderNNotesModel = (sequelize, DataTypes) => {
    const orderNotes = sequelize.define('order_notes', {
        u_id: DataTypes.INTEGER,
        check_out_id: DataTypes.INTEGER,
        noteDate: DataTypes.DATE,
        remarks: DataTypes.STRING
    })
    return orderNotes
}
export default orderNNotesModel
