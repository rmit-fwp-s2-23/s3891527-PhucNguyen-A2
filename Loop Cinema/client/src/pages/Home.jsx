import axios from 'axios';
import React, { useEffect, useState } from 'react'
import requests from '../tools/Requests';
import Row from '../components/Row';

const Home = () => {

  const [movies, setMovies] = useState([])
  const movie = movies[Math.floor(Math.random() * movies.length)]

  const userData = JSON.parse(localStorage.getItem('user'))
  const userName = userData ? userData.name : ""


    useEffect(() => {
        axios.get(requests.requestTopRated).then((response) => {
            setMovies(response.data.results)
        })
    }, [])
  
  return (
    <div className='flex flex-col gap-5'>
      <div className='w-full h-16 flex justify-center items-center'>
      {userName && <h2 className='text-white text-2xl font-semibold font-montserrat mt-5'>Welcome, {userName}!</h2>}
      </div>
        <div className='w-full h-[600px] relative'>
            <img className='w-full h-full object-cover' src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`} alt={movie?.title}></img>
            <div className='absolute top-1/2 flex flex-col gap-2 left-10'>
                <h1 className='text-white text-4xl font-semibold font-montserrat'>{movie?.title}</h1>
                <div className='flex flex-row gap-2'>                    
                  <button className='border bg-black border-blue p-2 rounded-md text-white font-semibold hover:bg-white hover:text-blue' onClick={() => { window.location.href = `/reviews/${movie.id}`}}>Review</button>
                </div>
                <p className='text-blue font-semibold'>Released: {movie?.release_date}</p>
            </div>
        </div>
        <div className='flex flex-col gap-10'>
          <Row rowID='1' title='Upcoming' fetchURL={requests.requestUpcoming} />
          <Row rowID='2' title='Top Rated' fetchURL={requests.requestTopRated} />
          <Row rowID='3' title='Popular' fetchURL={requests.requestPopular} />
        </div>
        
    </div>
  )
}

export default Home