const userPostReplyModel = (sequelize, DataTypes) => {
    const userPostReply = sequelize.define('userPostReply', {
        reply: DataTypes.STRING,
        time: DataTypes.DATE,
        image: DataTypes.STRING
    })
    return userPostReply
}

export default userPostReplyModel
