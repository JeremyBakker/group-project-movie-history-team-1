// This file builds the DOM elements for the wrapper section of index.html.
"use strict";

let movieLoad = require("../movies/movieLoad.js"),
    updateUser = require("../firebase-js/updateFirebase.js"),
    readFirebase = require("../firebase-js/readFirebase.js");

// let $ = require ("../lib/node_modules/jquery/dist/jquery.min.js");
    
/* 
Star Rating via rateYo
See http://rateyo.fundoocode.ninja/# 
*/
function rateMovie() {
 
    $(".rateYo").rateYo({
        starWidth: "20px",
        rating: 0,
        maxValue: 10,
        numStars: 10,
        fullStar: true,
        onSet: (rating, rateYoInstance) => {
            console.log(rating);
            $(event.currentTarget).closest(".card").addClass("rated");
            console.log('current target', $(event.currentTarget));
            let movieId = $(event.currentTarget).attr("id");
            console.log("movieId", $(event.currentTarget).attr("id"));
            let userID = $(event.currentTarget).closest(".card").attr("id");
            console.log('userID to send:', userID);
            
            readFirebase.getMovies(userID).then((movieData)=>{
            console.log("movieData in rateYo", movieData);
            let movieArray = [];
            for (var movies in movieData) {
                movieData.identifier = movies;
                movieArray.push(movieData[movies]);
            }
            console.log("movie Array in rateYo", movieArray);
            let movieTarget = movieArray.filter((movie)=> movie.uid == userID && movie.id == movieId);
            movieTarget[0].rating = rating;
            console.log("rating", rating);
            movieTarget[0].watched = true; 
            movieTarget[0].watchlist = false;
            console.log('movieTarget:', movieTarget);
            console.log("movieTarget Key", movieTarget.key);
            updateUser.deleteMovie(movieTarget[1], movieData.identifier);
            updateUser.editMovie(movieTarget[0], movieData.identifier);
            });
        }
    });
 
}

//puts cards on the DOM takes ad array of objects (movies)
function printCards(movies) {


    return new Promise((resolve, reject)=>{
        //dont need this promise bc synchronous
        $(".container").html("");

        let cards = "", 
            counter = 0;
            movies.forEach(movie => {
            if(movie.poster !== null) {

            cards += `<div class="thumbnail col-sm-6 col-md-4 untracked card" id="${movie.uid}">

                        <img src="https://image.tmdb.org/t/p/w500${movie.poster}" alt="...">
                        <div class="caption">
                            <h3>${movie.title}</h3>
                            <button type="button" class="btn btn-default add-to-watchlist" id="${movie.id}">Add to Watchlist</button>
                            <button type="button" class="btn btn-default delete" id="${movie.id}">Delete</button>
                            <div class="rateYo" id="${movie.id}">
                            </div>
                        </div>
                      </div>`;

            counter++;
//every three cards, make a section and prepend it to the container.                                    
            if (counter <= 3) {
                $(".container").empty();
                $(".container").append(`<section class="row">${cards}</section>`);
            } 
            else if (counter % 3 === 0) {
            $(".container").append(`<section class="row">${cards}</section>`);
            cards = ""; 
           }
        }
    }); //end forEach   

  });//end promise
}//end printCards


module.exports = {printCards, rateMovie};