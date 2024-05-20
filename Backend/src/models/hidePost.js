const hidePostModel = (sequelize, DataTypes) => {
    const hidePost = sequelize.define('hidePost', {
        post_id: DataTypes.INTEGER,
        u_id: DataTypes.INTEGER
    })
    return hidePost
}
export default hidePostModel
