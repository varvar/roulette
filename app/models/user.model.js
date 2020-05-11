module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING
        },
        ip: {
            type: DataTypes.STRING
        },
        lastLogin: {
            type: DataTypes.DATE,
            field: 'last_login',
        },
        loginCount: {
            type: DataTypes.INTEGER,
            field: 'login_count',
        }
    });

    return User;
};