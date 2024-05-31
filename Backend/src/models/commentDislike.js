const disLikeCommentModel = (sequelize, DataTypes) => {
    const disLikeComment = sequelize.define('disLikecomment', {})
    return disLikeComment
}
export default disLikeCommentModel
