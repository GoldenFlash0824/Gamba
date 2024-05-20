const likedCommentModel = (sequelize, DataTypes) => {
    const likeComment = sequelize.define('commentLikes', {})
    return likeComment
}
export default likedCommentModel
