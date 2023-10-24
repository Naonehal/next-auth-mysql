const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
    validPassword(password) {
        return bcrypt.compareSync(password, this.hash);
    }
}

const initModel = (sequelize) => {
    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: { // Add this
            type: DataTypes.STRING,
            allowNull: true
        },
        lastName: { // And this
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'User'
    });

    User.beforeCreate((user) => {
        user.hash = bcrypt.hashSync(user.hash, bcrypt.genSaltSync(10), null);
    });

    return User;
};

module.exports = initModel;
