const userModel = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        auth_token: DataTypes.STRING,
        login_token: DataTypes.STRING,
        social_id: DataTypes.STRING,
        image: DataTypes.STRING,
        fcm_token: DataTypes.STRING,
        phone: DataTypes.STRING,
        verification_code: DataTypes.INTEGER,
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        lat: DataTypes.DOUBLE,
        log: DataTypes.DOUBLE,
        is_block: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_block_payment: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        dob: DataTypes.STRING,
        address: DataTypes.STRING,
        about: DataTypes.TEXT,
        gender: DataTypes.STRING,
        disable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        two_fector_auth: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        two_fector_auth_check_detail: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        stripe_id: DataTypes.STRING,
        chat_id: DataTypes.STRING,
        display_profile: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        display_phone: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        display_email: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        display_dob: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        display_location: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        display_dob_full_format: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        stripe_account_id: DataTypes.STRING,
        stripe_account_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        stripe_customer_id: DataTypes.STRING,
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        delete_reason: DataTypes.STRING,
        ref_id: {
            type: DataTypes.VIRTUAL,
            get() {
              const desiredLength = 7;
              const propertyString = String(this.id);
              return propertyString.length < desiredLength ? '0'.repeat(desiredLength - propertyString.length) + propertyString : propertyString;
            },
        },
    })
    return user
}

export default userModel
