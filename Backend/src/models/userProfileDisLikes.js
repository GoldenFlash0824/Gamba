const userProfileDisLikesModel = (sequelize, DataTypes) => {
    const disLikeUser = sequelize.define('userProfileDislikes', {
        //f_id and u_id comes from relation
    })
    return disLikeUser
}
export default userProfileDisLikesModel
