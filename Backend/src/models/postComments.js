const postCommentsModel = (sequelize, DataTypes) => {
    const userComments = sequelize.define('userComments', {
        u_id: DataTypes.INTEGER,
        comment: DataTypes.STRING
        //comment on which post ?
    })
    return userComments
}
export default postCommentsModel
