'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {foreignKey: 'userId', targetKey: 'id'});
            this.hasMany(models.Comment, {foreignKey: 'postId', sourceKey: 'id'});
            this.hasMany(models.PostLike, {foreignKey: 'postId', sourceKey: 'id'});

        }
    }

    Post.init({
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        likeCount:DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Post',
    });

    return Post;
};