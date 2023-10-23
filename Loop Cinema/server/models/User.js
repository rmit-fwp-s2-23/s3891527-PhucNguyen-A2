module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      name: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING
      }
    });
  
    User.associate = models => {
      User.hasMany(models.Review, {
        foreignKey: 'userEmail',
        as: 'reviews',
      });
      User.hasMany(models.Booking, {
        foreignKey: 'userEmail',
        as: 'bookings',
      });
    };
  
    return User;
};
  