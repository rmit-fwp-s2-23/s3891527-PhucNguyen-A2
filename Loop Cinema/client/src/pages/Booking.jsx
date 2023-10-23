import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../tools/Requests';
import UserContext from '../tools/UserContext';
import { TbArmchair, TbArmchairOff } from 'react-icons/tb';

const Booking = () => {
    const { movieId } = useParams();
    const { user } = useContext(UserContext);
    const [movie, setMovie] = useState([]); 
    const [bookedSeats, setBookedSeats] = useState([]);
    const [date, setDate] = useState(''); 
    const [seats, setSeats] = useState([]); 
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
    const availableSeats = ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'C1', 'C2', 'C3', 'C4', 'C5'];
  
    useEffect(() => {
        axios.get(getMovieDetails(movieId))
            .then(response => {
                setMovie(response.data);
            });        
            axios.get(`http://localhost:8000/bookings/${movieId}`)
            .then(response => {
                const bookedSeatsData = response.data.map(booking => booking.seat);
                setBookedSeats(bookedSeatsData);
            })
            .catch(error => {
                console.error("There was an error fetching the bookings!", error);
            });
    }, [movieId]);


    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1; // January is 0!
        let day = today.getDate();
    
        // Pad month and day with leading zeros if needed
        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
    
        return year + '-' + month + '-' + day;
      };
    
    // Function to chunk the seats array into rows
    const chunkArray = (myArray, chunkSize) => {
    let results = [];
    
    while (myArray.length) {
      results.push(myArray.splice(0, chunkSize));
    }
    
    return results;
    };
  
    // Divide seats into rows of 5
    const seatsInRows = chunkArray([...availableSeats], 5);

    const handleDateChange = (e) => {
      setDate(e.target.value);
    }
  
    const handleSeatChange = (e) => {
      const value = e.target.value;
      if (seats.includes(value)) {
        setSeats(seats.filter(seat => seat !== value));
      } else {
        setSeats([...seats, value]);
      }
    }
  
    const handleSubmitBooking = () => {
        setSuccessMessage('');
        setErrorMessage('');

      const userEmail = user.email
      const movieName = movie.title
      const newBooking = {
          userEmail,
          movieId,
          movieName,
          date,
          seats
      };
      setBookingConfirmed(true);
      axios.post('http://localhost:8000/submit-bookings', newBooking)
            .then(response => {
                // Handle success here. For example, you might clear the form and show a success message.
                console.log(response.data);
                setSuccessMessage(response.data.message || 'Booking submitted successfully!');
            })
  
    // Render a confirmation message if the booking is complete
    if (bookingConfirmed) {
      return <div>Your booking has been confirmed!</div>;
    }
    }
    
  
    return (
        <div className='flex flex-col h-screen w-full items-center justify-center gap-5'>
          <h1 className='text-white font-montserrat font-bold text-4xl'>Movie Booking</h1>
          <div className="flex flex-col gap-2 items-center justify-center w-1/3">
                <img className="rounded-md object-cover w-full h-full" src={`https://image.tmdb.org/t/p/w500/${movie?.backdrop_path}`} alt={ movie?.title }></img>
                <h1 className='text-white font-montserrat font-bold text-3xl'>{movie?.title}</h1>
          </div>
          <form className='flex flex-col items-center justify-center'>    
            {/* Date selection */}
            <div className='flex flex-col text-center'>
              <label className='text-white text-lg gap-2'>
                Choose a date:
                </label>
                <input type="date" value={date} min={getTodayDate()} onChange={handleDateChange} required />
              
            </div>
            {/* Seat selection */}
            <div className='flex flex-col items-center justify-center'>
          <p className='text-white text-lg'>Choose seats:</p>
          {seatsInRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row">
            {row.map((seat) => {
            const isBooked = bookedSeats.includes(seat);
            const isSelected = seats.includes(seat);
              
              return (
                <div key={seat} className={`m-2 ${isBooked ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      className="hidden"
                      value={seat}
                      disabled={isBooked}
                      checked={isSelected}
                      onChange={handleSeatChange}
                    />
                    {isBooked ? (
                      <TbArmchairOff size={24} className="text-grey" />
                    ) : (
                        <div>
                            <TbArmchair 
                        size={24} 
                        className={isSelected ? "text-blue" : "text-white"}
                        onClick={() => !isBooked && handleSeatChange({ target: { value: seat }})}
                      />
                      <span className={isSelected ? "text-blue" : "text-white"}>{seat}</span>
                        </div>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
          ))}
        </div>
            {successMessage && <p className='text-green'>{successMessage}</p>}
            {errorMessage && <p className='text-red'>{errorMessage}</p>}
            <button className="text-blue font-semibold font-montserrat bg-white p-2 rounded-md border-2" onClick={handleSubmitBooking} type="submit">Confirm Booking</button>
          </form>
        </div>
      );
  }
  
  export default Booking;