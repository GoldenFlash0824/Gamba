const postsModel = (sequelize, DataTypes) => {
    const userPostes = sequelize.define('userPosts', {
        description: DataTypes.TEXT('long'),
        u_id: DataTypes.INTEGER,
        images: {
            type: DataTypes.JSON,
            get() {
                return typeof this.getDataValue('images') == 'string' ? JSON.parse(this.getDataValue('images')) : this.getDataValue('images')
            }
        },
        title: DataTypes.STRING,
        privacy: DataTypes.STRING,
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        future_post_date: DataTypes.STRING
    })
    return userPostes
}
export default postsModel
