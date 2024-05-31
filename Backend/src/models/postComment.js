const userPostCommentModel = (sequelize, DataTypes) => {
    const userPostComment = sequelize.define('userPostComments', {
        comment: DataTypes.STRING,
        time: DataTypes.DATE,
        image: {
            type: DataTypes.STRING,
            defaultValue: ''
        }
    })
    return userPostComment
}

export default userPostCommentModel
