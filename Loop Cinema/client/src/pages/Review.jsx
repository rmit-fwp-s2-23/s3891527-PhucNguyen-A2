import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getMovieDetails } from '../tools/Requests';
import UserContext from '../tools/UserContext';


function Review() {
    const { movieId } = useParams();
    const { user } = useContext(UserContext);
    const [movie, setMovie] = useState({});
    const [rating, setRating] = useState(1);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null); // State to hold the average rating
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios.get(getMovieDetails(movieId))
            .then(response => {
                setMovie(response.data);
            });
        
            axios.get(`http://localhost:8000/reviews/${movieId}`)
            .then(response => {
                const fetchedReviews = response.data.reviews; // Adjust depending on how your data is structured
                setReviews(fetchedReviews);

                // Calculate the average rating
                const totalRating = fetchedReviews.reduce((total, review) => total + review.rating, 0);
                setAverageRating((totalRating / fetchedReviews.length).toFixed(2)); // Average and round to 2 decimal places
            })
            .catch(error => {
                console.log('Error fetching reviews:', error);
            });   
    }, [movieId]);
    
    const handleSubmitReview = () => {

        setSuccessMessage('');
        setErrorMessage('');
        
        const userEmail = user.email
        const movieName = movie.title
        const newReview = {
            movieId,
            movieName,
            userEmail,
            rating,
            reviewText
        };
        axios.post('http://localhost:8000/submit-review', newReview)
            .then(response => {
                // Handle success here. For example, you might clear the form and show a success message.
                console.log(response.data);
                setReviewText(''); // Clear the form
                setSuccessMessage(response.data.message || 'Review submitted successfully!');
            })
            .catch(error => {
                if (error.response) {
                    setErrorMessage(error.response.data.message || 'Error submitting review.');
                  } else if (error.request) {
                    // The request was made but no response was received
                    setErrorMessage('No response received from the server. Please try again.');
                  } else {
                    // Something happened in setting up the request that triggered an Error
                    setErrorMessage('Error submitting review. Please try again.');
                  }
                })
    };

    return (
        <div className='flex h-screen w-full items-center justify-center'>
            <div className="flex flex-col gap-2 items-center justify-center w-1/3">
            <img className="rounded-md object-cover w-full h-full" src={`https://image.tmdb.org/t/p/w500/${movie?.backdrop_path}`} alt={ movie?.title }></img>
            <h1 className='text-white font-montserrat font-bold text-4xl'>{movie?.title}</h1>
            {averageRating && (
                    <h2 className='text-white font-montserrat text-lg'>Average Rating: {averageRating}★</h2>
            )}

            {user ? (
            <>
                <div className="flex cursor-pointer">
                    {Array(5).fill(0).map((_, index) => (
                        <span 
                            key={index}
                            onClick={() => setRating(index + 1)}
                            className={`text-4xl   ${index < rating ? "text-gold" : "text-white"}`}
                        >
                        ★
                        </span>
                    ))}
                </div>
                        
                <textarea 
                    className="w-full h-32 p-2 rounded-md border bo" 
                    value={reviewText} 
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="Write your review here..."
                    //set review max 600 characters
                    maxLength='600'
                ></textarea>
                {successMessage && <p className='text-green'>{successMessage}</p>}
                {errorMessage && <p className='text-red'>{errorMessage}</p>}
                <button className="text-blue font-semibold font-montserrat bg-white p-2 rounded-md border-2" onClick={handleSubmitReview}>
                Submit Review
                </button>
                <button className='font-montserrat border bg-black border-blue p-2 rounded-md text-white font-semibold hover:bg-white hover:text-blue' onClick={() => { window.location.href = `/bookings/${movieId}`}}>Book a Ticket</button>
                    </>
                ) : (
                    <div className='flex flex-col justify-center items-center'>
                        <p className='text-white'>Please log to book a ticket.</p>
                        <p className='text-white'>Please log in to submit a review.</p>
                    </div>
                )}
                <div className="w-full mt-5 flex flex-col gap-2">
                <h2 className='text-white font-montserrat font-bold text-2xl'>Reviews:</h2>
                {reviews.map((review, index) => (
                    <div key={index} className="w-full rounded-md p-2 pt-2">
                        <h3 className='text-blue font-montserrat font-semibold'>{review.userEmail} ({review.rating}★):</h3> {/* Change 'userEmail' if you have a different field for the reviewer's name */}
                        <p className='text-white'>{review.reviewText}</p>
                    </div>
                ))}
            </div>
        </div>
        </div>
        
    );
}

export default Review;
