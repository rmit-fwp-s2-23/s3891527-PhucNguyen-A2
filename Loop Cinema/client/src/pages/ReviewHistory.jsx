import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import UserContext from '../tools/UserContext';

const ReviewHistory = () => {

    const { user } = useContext(UserContext);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the reviews when the component is mounted
        const fetchReviews = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/user-reviews/${user.email}`);
            setReviews(response.data);
          } catch (error) {
            console.error('Error fetching reviews:', error);          }
        };
    
        if (user) {
          fetchReviews();
        }
      }, [user]);

    const handleDelete = async (reviewId) => {
        try {
          await axios.delete(`http://localhost:8000/user-reviews/delete/${reviewId}`);
          // On success, remove the review from the current state
          setReviews(reviews.filter(review => review.reviewId !== reviewId));
          setError(null)
        } catch (error) {
          console.error('Error deleting review:', error);
          setError(error);
        }
      };
    return (
    <div className='flex h-screen w-full items-center justify-center'>
        <div className="flex flex-col gap-2 items-center justify-center w-1/3">
            <h1 className='text-white font-montserrat font-bold text-4xl'>Your Reviews</h1>
      {error && <p className='text-red'>{error}</p>}
      {reviews.length === 0 ? (
        <p className='text-white'>You haven't written any reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((review, index) => (
            <div className='text-white flex flex-col my-5' key={index}>
              <h2 className='font-montserrat font-semibold text-lg'>{review.movieName}{}</h2>
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.reviewText}</p>
              <button className='bg-red rounded-md p-1' onClick={() => handleDelete(review.reviewId)}>Delete Review</button>
            </div>
          ))}
        </ul>
      )}
        </div>
        
    </div>
  )
}

export default ReviewHistory