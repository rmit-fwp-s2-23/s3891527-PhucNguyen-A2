module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      reviewId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      movieId: {
        type: DataTypes.INTEGER,
      },
      movieName: {
        type: DataTypes.STRING,
      },     
      userEmail: {
        type: DataTypes.STRING,
        references: {
          model: 'Users',
          key: 'email',
        }
      },      
      rating: {
        type: DataTypes.INTEGER
      },
      reviewText: {
        type: DataTypes.TEXT
      },  
    });
  
    Review.associate = models => {
      Review.belongsTo(models.User, {
        foreignKey: 'userEmail',
        as: 'user',
        onDelete: 'CASCADE'
      });
    };
  
    return Review;
  };
  