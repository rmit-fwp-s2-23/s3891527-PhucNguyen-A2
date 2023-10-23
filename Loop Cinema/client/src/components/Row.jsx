import React, { useEffect, useState } from "react";
import axios from "axios";
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import Movie from "./Movie";

function Row({title, fetchURL, rowID}) {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        axios.get(fetchURL).then((response) => {
            setMovies(response.data.results)
        })
    },[fetchURL])

    const slideLeft = () => {
        var slider = document.getElementById('slider' + rowID);
        slider.scrollLeft = slider.scrollLeft - 400;
    }

    const slideRight = () => {
        var slider = document.getElementById('slider' + rowID);
        slider.scrollLeft = slider.scrollLeft + 400;
    }
    

    return <div className="flex flex-col gap-5 w-full">
        <h1 className="text-white text-2xl font-bold font-moneserrat left-5">{title}</h1>
        <div className="flex relative items-center">
            <MdChevronRight onClick={slideRight} className="bg-white cursor-pointer opacity-50 text-4xl absolute rounded-full right-0 z-10 hover:opacity-100"/>
            <div className="w-full h-full whitespace-nowrap overflow-hidden scroll-smooth" id={'slider' + rowID}>
                {movies.map((item, id) => (
                    <Movie key={id} item={item} onClick={() => {
                        // Redirect to Review page with the movie ID
                        window.location.href = `/reviews/${item.id}`;
                    }}/>
                    
                ))}
            </div>
            <MdChevronLeft onClick={slideLeft} className="bg-white cursor-pointer opacity-50 text-4xl absolute rounded-full hover:opacity-100"/>
        </div>

    </div>
} 

export default Row;