//the API documentation site https://developers.themoviedb.org/3/

//APP RENDERS MOVIE AT HOMEPAGE
class App {
    static async run() {
        const movies = await APIService.fetchMovies()
        HomePage.renderMovies(movies);
            const genreList = await APIService.fetchGenres()
          GenresMovies.renderGenres(genreList);
    }


  static async runPopularMovies(movies) {
    const popularmovies = await APIService.fetchPopularMovies(movies);
    HomePage.renderMovies(popularmovies)
  }

static async runTopRatedMovies(movies) {
    const topRatedmovies = await APIService.fetchTopRatedMovies(movies);
    HomePage.renderMovies(topRatedmovies)
  }

  static async runUpcomingMovies(movies) {
    const upcomingmovies = await APIService.fetchUpcomingMovies(movies);
    HomePage.renderMovies(upcomingmovies)
  }
}


//APISERVICE FETCHES NOW PLAYING MOVIES DATA AND RETURN RESULTS
class APIService {
    static TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    static async fetchMovies() {
        const url = APIService._constructUrl(`movie/now_playing`)
        const response = await fetch(url)
        const data = await response.json()
        //console.log(data);
        return data.results.map(movie => new Movie(movie))
    }

    //Fetches SINGLE Movie Data
    static async fetchMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}`)
        const response = await fetch(url)
        const data = await response.json()
        //  console.log("moveiDATA" , data);
        return new Movie(data)
    }

   //creates a path for the data
  static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
    }
}

//HOMEPAGE RENDER(Movies)&DOM
class HomePage {
    static container = document.getElementById('container');
    static renderMovies(movies) {
        movies.forEach(movie => {


            const movieDiv = document.createElement("div");
            movieDiv.classList.add("movie-divs");
            const imageDiv = document.createElement("div");
            imageDiv.classList.add("image-divs");
            const movieImage = document.createElement("img");
            movieImage.classList.add("img-fluid");
            movieImage.classList.add("rounded");
            movieImage.src = `${movie.backdropUrl}`;
            const movieTitle = document.createElement("h3");
            movieTitle.textContent = `${movie.title}`;
            const movieContent=document.createElement("div");
             movieContent.classList.add("content");
            const movieOverview=document.createElement("div");
            movieOverview.classList.add('movie-overview');
            movieOverview.textContent=`${movie.overview}`;
            const movieRating=document.createElement("p");
            movieRating.classList.add("movie-ratings");
            movieRating.textContent=`⭐${movie.rateAverage}/10, ${movie.rateCount} votes`;
            movieImage.addEventListener("click", function() {
              ActorsPage.containerActor.innerHTML = ""
                Movies.run(movie);
            });

            movieDiv.appendChild(imageDiv);
            movieDiv.appendChild(movieTitle);
            imageDiv.appendChild(movieImage);
            movieDiv.appendChild(movieRating);
            imageDiv.appendChild(movieContent);
            movieContent.appendChild(movieOverview);
            this.container.appendChild(movieDiv);

        })
    }
}

//MOVIES RUN ASYNC SINGLE MOVIE PAGE(MOVIEPAGE)
class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id)

        const movieActors = await APIService.fetchCredits(movie.id)

        MoviePage.renderMovieSection(movieData,movieActors);

    }

}

//SINGLE MOVIE PAGE(MOVIEPAGE) Connected with MOVIESECTION
class MoviePage {
    static container = document.getElementById('container');
    static renderMovieSection(movie,actors) {
        MovieSection.renderMovie(movie,actors);
    }

}

//MOVIESECTION Connected with SINGLE MOVIE PAGE(MOVIEPAGE)
//Includes InnerHTML of SINGLE MOVIE PAGE
class MovieSection {
    static renderMovie(movie, actors) {
      const LIMIT_ACTORS = 5;

      const htmlActors = []
      for(let i = 0 ; i < LIMIT_ACTORS;i++ ){
        htmlActors.push(`<span>${actors[i].name}, </span>`);
      }

        MoviePage.container.innerHTML = `
        <div class="col-md-4">
          <img  class="img-fluid float-left max-width:20rem rounded" id="movie-backdrop" src=${movie.backdropUrl}>
        </div>
        <div class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="movie-rate">⭐${movie.rateAverage}/10, ${movie.rateCount} votes</p>
          <p id="genres">${movie.genres}</p>
          <span id="movie-release-date">${movie.releaseDate}</span>
          <span id="movie-runtime">| ${movie.runtime}</span>
         <span id="original_language">| ${movie.language}</span>
         </div>
          <div>
          <h3>Overview:</h3>
          <p id="movie-overview">${movie.overview}</p>
            <h4 id ="movieActors">Actors:</h4>
            ${htmlActors.join("")}
          <p><b>Production Co:</b>${movie.companies}</p>
        </div>
    `;
    }
}

//CREATES OBJECTS INSIDE OF SINGLE MOVIE PAGE
class Movie {
    static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
          //console.log(json)
        this.id = json.id;
        this.title = json.title;
        this.genres = "";
        for( let i in json.genres){
            this.genres += json.genres[i].name + " "; }
        this.releaseDate = json.release_date;
        this.runtime = json.runtime + " minutes";
        this.overview = json.overview;
        this.backdropPath = json.backdrop_path;
        this.backdropposter = json.poster_path
        this.language=json.original_language;

        this.companies="";
        for (let i in json.production_companies){
        this.companies+=json.production_companies[i].name +", ";}
        this.rateAverage=json.vote_average;
        this.rateCount=json.vote_count;

    }
    get backdropUrl() {
        return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath || this.backdropposter : "";
    }

}


//NAVBAR HOME BUTTON FUNCTIONALITY
const  homeButton = document.getElementById("homeButton");
homeButton.addEventListener("click", function(){
   if (true){
      MoviePage.container.innerHTML = ""
      ActorsPage.containerActor.innerHTML = ""
      GenrePage.containerGenre.innerHTML = ""
      App.run()
   }
});


//RUNS APP after DOMContent Loaded
document.addEventListener("DOMContentLoaded", App.run);