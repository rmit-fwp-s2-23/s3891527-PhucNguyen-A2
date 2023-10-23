const { Sequelize, DataTypes } = require('sequelize')
const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const sequelize = new Sequelize('s3891527_fwp_a2', 's3891527_fwp_a2', 'abc123', {
    host: 'rmit.australiaeast.cloudapp.azure.com',
    dialect: 'mysql'
  });

const User = require("./models/User")(sequelize, DataTypes)
const Review = require("./models/Review")(sequelize, DataTypes)
const Booking = require("./models/Booking")(sequelize, DataTypes)

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced");
    app.listen(8000, () => {
        console.log('Server is running on port 8000');
    });
}).catch((error) => {
    console.error('Error syncing database:', error);
});

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

        // Hash the password
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.error("Hashing error:", err);
            return res.status(500).json({ message: "Hashing error." });
    }

    try {
        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: { name, password: hash }
        });

        if(created) {
            return res.status(201).json({ message: "Success", user: { name: user.name, email: user.email } });
        } else {
            return res.status(400).json({ message: "User with this email already exists." });
        }

    } catch (error) {
        console.error("Database error:", error)
        return res.status(500).json({ message: "Database error." })
    }
    })
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // Login successful, return user data
        return res.json({ success: true, message: "Logged in successfully!", user: { name: user.name, email: user.email, date: user.createdAt } });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Database error." });
    }
});

app.post('/submit-review', async (req, res) => {
    try {
        const { movieId, movieName, userEmail, rating, reviewText } = req.body;
        if (!movieId || !userEmail || rating === undefined || !reviewText) {
            return res.status(400).json({ message: "All review submission fields are required." });
        }
        // Create a new Review in the database
        const review = await Review.create({
            movieId,
            movieName,
            userEmail,
            rating,
            reviewText
        });
        return res.status(201).json({ message: "Review submitted successfully!", review });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Error submitting review." });
    }
});

app.get('/reviews/:movieId', async (req, res) => {
    const movieId = req.params.movieId;

    try {
        // Fetch all reviews for the given movieId
        const reviews = await Review.findAll({ where: { movieId: movieId } });

        // If there are no reviews, return an appropriate response
        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this movie." });
        }

        // Calculate the average rating
        let totalRating = 0;
        reviews.forEach(review => {
            totalRating += review.rating;
        });
        const averageRating = totalRating / reviews.length;

        // Send the reviews and average rating to the client
        res.json({ reviews, averageRating });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: "Error retrieving reviews from the database." });
    }
});

app.get('/user-reviews/:userEmail', async (req, res) => {
    const userEmail = req.params.userEmail;
    try {
        const userReviews = await Review.findAll({ where: { userEmail: userEmail }});
        if (userReviews.length > 0) {
            res.json(userReviews);
        } else {
            res.status(404).json({ message: 'No reviews found for this user' });
        }
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).send('Server error while fetching reviews');
    }
});

app.delete('/user-reviews/delete/:id', async (req, res) => {
    const reviewId = req.params.id;
    try {   
        const numberOfDeletedReviews = await Review.destroy({ where: { reviewId: reviewId }});
        if (numberOfDeletedReviews === 0) {
            res.status(404).json({ message: 'Review not found' });
        } else {
            res.status(200).json({ message: 'Review deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send('Server error while deleting review');
    }
});

app.put('/user/name', async (req, res) => {

    const { name, email } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        user.name = name;
        await user.save();

        return res.json({ success: true, message: 'Name updated successfully!' });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Database error." });
    }
});

app.put('/user/password', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect current password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.delete('/user/delete', async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { email } = req.body;

        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        // Delete all reviews by the user
        await Review.destroy({ where: { userEmail: email } }, { transaction });

        // Delete the user
        await user.destroy({ transaction });

        await transaction.commit();

        res.send({ success: true, message: 'User and their reviews deleted successfully' });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
});

app.get('/bookings/:movieId', async (req, res) => {
    const movieId = req.params.movieId;
    try {
        const bookings = await Booking.findAll({ where: { movieId: movieId } });
        if (bookings) {
            return res.status(200).json(bookings);
          } else {
            return res.status(404).json({ message: "No bookings found for this movie ID" });
        }
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).send({ message: "Error retrieving bookings" });
    }
});

app.post('/submit-bookings', async (req, res) => {
    const { userEmail, movieId, movieName, seats, date } = req.body;

    // Input validation: Check if all required fields are provided
    if (!seats || !date) {
        return res.status(400).send({ message: "All booking details must be provided!" });
    }

    try {
        const newBooking = await Booking.create({ userEmail, movieId, seats, date });

        return res.status(201).send(newBooking);
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).send({ message: "Error creating booking" });
    }
});