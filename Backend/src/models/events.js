const eventsModel = (sequelize, DataTypes) => {
    const userEvents = sequelize.define('userEvents', {
        u_id: DataTypes.INTEGER,
        price: DataTypes.INTEGER,
        title: DataTypes.STRING,
        location: DataTypes.STRING,
        latitude: DataTypes.STRING,
        longitude: DataTypes.STRING,
        start_date: DataTypes.STRING,
        end_date: DataTypes.STRING,
        summary: DataTypes.TEXT,
        image: DataTypes.STRING,
        is_private: DataTypes.BOOLEAN,
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        privacy: DataTypes.STRING,
        limit_to: DataTypes.STRING,
        limit_to_number: DataTypes.INTEGER,
        ref_id: {
            type: DataTypes.VIRTUAL,
            get() {
              const desiredLength = 7;
              const propertyString = String(this.id);
              return propertyString.length < desiredLength ? '0'.repeat(desiredLength - propertyString.length) + propertyString : propertyString;
            },
        },
    })
    return userEvents
}
export default eventsModel
