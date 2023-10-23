const key = '17c7fe364354af207b9dfff14b7ccd02'

const requests = {
    requestUpcoming: `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=1`,
    requestPopular: `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`,
    requestTopRated: `https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=en-US&page=1`,  
};

export default requests

export const getMovieDetails = (movieId) => {
    return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${key}`;
}