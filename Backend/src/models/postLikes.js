const postLikesModel = (sequelize, DataTypes) => {
    const likeUser = sequelize.define('userLikes', {
        //post_id and u_id comes from relation
    })
    return likeUser
}
export default postLikesModel
