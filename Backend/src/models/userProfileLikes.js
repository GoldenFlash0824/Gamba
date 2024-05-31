const userProfileLikesModel = (sequelize, DataTypes) => {
    const likeUser = sequelize.define('userProfileLikes', {
        //f_id and u_id comes from relation
    })
    return likeUser
}
export default userProfileLikesModel
