import React from "react";

const Movie = ({item, onClick}) => {
    return (
        <div className="cursor-pointer relative inline-block mx-2" onClick={onClick}>
            <img className="rounded-md object-cover w-full h-full" src={`https://image.tmdb.org/t/p/w200/${item?.backdrop_path}`} alt={ item?.title }></img>
            <div className="absolute top-0 left-0 rounded-md flex items-center justify-center  w-full h-full opacity-0 hover:bg-black hover:opacity-80">
                <p className="text-white">{item?.title}</p>
            </div>
        </div>
    )
}

export default Movie