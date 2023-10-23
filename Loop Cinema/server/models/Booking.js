module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
    bookingId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },       
    movieId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    seats: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    userEmail: {
        type: DataTypes.STRING,
        references: {
          model: 'Users',
          key: 'email',
        }
      },
    });
  
    Booking.associate = models => {
      Booking.belongsTo(models.User, {
        foreignKey: 'userEmail',
        as: 'user', 
        onDelete: 'CASCADE', 
      });
    };
  
    return Booking;
  };
  