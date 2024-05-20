const reportedPostModel = (sequelize, DataTypes) => {
    const reportedPost = sequelize.define('reportedPost', {
        u_id: DataTypes.INTEGER,
        post_id: DataTypes.INTEGER,
        reason: DataTypes.STRING
    })
    return reportedPost
}
export default reportedPostModel
