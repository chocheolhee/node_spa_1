'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PostLike extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {foreignKey: 'userId', targetKey: 'id'});
            this.belongsTo(models.Post, {foreignKey: 'postId', targetKey: 'id'});
        }
    };
    PostLike.init({

    }, {
        sequelize,
        modelName: 'PostLike',
    });

    return PostLike;
};