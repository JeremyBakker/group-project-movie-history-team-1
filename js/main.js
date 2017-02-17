"use strict";

/* 

Movie History is a multiple-page application that allows users to view 
and store movies. 
There is an initial page, visible by anyone, that serves the purpose of 
listing movies from OMDb API. The user is able to search for movies
by title, series, episodes, or year. From the visitor page, 
the user is also prompted to create an account with us. 
For this application, we use firebase as our user database. 

We refer to firebase to store movie information related to our 
member. Movie information includes the following: 
	1. userId
	2. movieID
	3. watched (true or false)
	4. rating of the movie
	5. email
	6. password
	7. username

If the user is a member of the application, they are allowed a special 
page. 
This page allows the member to store specific information about their 
favorite movies. This information includes: 
	
	1. Whether or not they've watched the movie
	2. A personal rating that they give to the movie
		(comparable to rotten tomatoes rating)
*/

/*============================================*/
/*================REQUIRES====================*/
/*============================================*/
let config = require('./firebase-js/configFirebase.js'),
	readFirebase = require('./firebase-js/readFirebase.js'),
	createUser = require('./firebase-js/createUser.js'),
	updateUser = require('./firebase-js/updateFirebase.js'),
	removeUser = require('./firebase-js/deleteFirebase.js'),
	movieLoad = require('./movies/movieLoad.js'),
	printer = require ('./templates/movieTemplate.js');

/*============================================*/
/*==================LOGIN=====================*/
/*============================================*/

 //login
$("#login").click(()=>{
	console.log('you clicked login');
	createUser.logInGoogle();  
});

//logout
$("#logout").click(()=>{
	console.log('you clicked logout');
	createUser.logOut();
	$("#logout").addClass("hidden");
    $("#login").removeClass("hidden");
});


//Sends you to the main movie-listing page without signup
// $('.browse-movies').click(function(event) {
// 	movieLoad.movieAPI().then(
// 		() => {
// 			$('.login').addClass('hidden');
// 			$('.visitor').removeClass('hidden');
// 		}
// 	);
// });



/*============================================*/
/*=================VISITOR====================*/
/*============================================*/



/*

This function will serve to filter the movies on the visitor page.
*/

// $('.movie-filters').change(function(event) {
// 	let targetVal = $(event.target).val();
// 	switch (targetVal) {
// 		case "year":
// 			console.log(targetVal);
// 			break;
// 		case "type": 
// 			console.log(targetVal);
// 			break;
// 		case "title":
// 			console.log(targetVal);
// 			break;
// 	}
// });




/*============================================*/
/*=================MEMBER=====================*/
/*============================================*/


/* 

Function that filters the user page. The filters include: 

	1. Watched Movies
	2. Un-Watched movies
	3. All Movieas
*/

/* The function filters by adding and removing a class that hides the irrelevant cards
*/

$('.btn-group').click(function(event) {
	let buttonValue = $(event.target).val();
	$(".card").addClass("hidden");
	$('.searchView').html("Movie History >");
	switch (buttonValue) {
		case "untracked": 
			$('.untracked').removeClass("hidden");
			$('.searchView').html("Movie History > Untracked");
			console.log(buttonValue);
			break;
		case "unwatched": 
			$('.unwatched').removeClass("hidden");
			$('.searchView').html("Movie History > Unwatched");
			console.log(buttonValue);
			break;
		case "watched": 
			$('.watched').removeClass("hidden");
			$('.searchView').html("Movie History > Watched");
			console.log(buttonValue);
			break;
	}
});

$("#slider").change((event)=>{
	console.log($("#slider").val()); //this line will be replaced with a function that filters movies by rating
	// console.log("user", movie.user);
	readFirebase.getMovies(createUser.getUser()).then((movieData)=>{
		let movieArray = [];
		console.log("movieData in slider", movieData);
		for (let movies in movieData) {
			console.log("movieData[movies]", movieData[movies]);
			console.log("movieData[movies].rating", movieData[movies].rating);
			if (movieData[movies].rating >= $("#slider").val()) {
				movieArray.push(movieData[movies]);
			}
		}
		console.log("Movie Array sent to Print", movieArray);
		printer.printCards(movieArray);
	});
});

/* 

Function that checks OMDb and our firebase database for specific keywords
to search movies with the search input.
*/

$('.form-control').keyup(function(event) {
  
    	if(event.which == 13) {
        	// console.log('this.value line 180:', $(this).val());
        	movieLoad.pullMovieByTitle($(this).val())
			.then((movieData)=>{
			// console.log('movieData passed to parse:', movieData);
			 movieLoad.parseMovies(movieData)
			 .then((moviesArray)=>{
			 	$(".form-control").html("");
			 	printer.printCards(moviesArray);
			 	clickRegister();//puts the listener on the button
			 });
			 
		});
   }

});
//need to attach user id variable here
/* 

This function adds movies to the user's watched-list within firebase and changes the 
watched boolean value to false. It also adds the movie to the user's movie list.
*/

//instead of calling function could use jquery live: $(".add-to-watchlist").live('click', function(event)
function clickRegister() {
	$(".add-to-watchlist").click(function(event) {
		// console.log("you clicked addtowatchlist");
		$(this).closest(".card").addClass("unwatched").removeClass("untracked");
		// console.log('this', $(this));
		let movieId = $(this).attr("id");
		let userID = $(this).closest(".card").attr("id");
		// console.log('userID to send:', userID);

		let thisArray = movieLoad.getMoviesArray();
		// console.log('thisArray:', thisArray);
		let movieTarget = thisArray.filter((movie)=> movie.uid == userID && movie.id == movieId);
		 // console.log('movieTarget should be false:', movieTarget);
		 movieTarget[0].watchlist = true;
		 movieTarget[0].untracked = false;

		console.log('movieTarget:', movieTarget);
		updateUser.addMovie(movieTarget[0]);
		printer.rateMovie();
	});
}


/*

Listens for a card to be deleted from the movie list
ONLY AVALABLE WITH THE USER'S WATCHED OR UNWATCHED MOVIES
*/



$(document).on("click", ".delete", (function(event) {
	// let movieId = $(this).attr("id");
	// console.log('movieId to delete:', movieId);
	let userID = $(this).closest(".card").attr("id");
	console.log('userID to send:', userID);
	// let thisArray = movieLoad.getMoviesArray();
	// console.log('thisArray:', thisArray);
	// let movieTarget = thisArray.filter((movie)=> movie.user == userID && movie.id == movieId);
	// console.log('movieTarget:', movieTarget); 
	// let movieObjId = movieTarget[0].id;
	// console.log('movieObjId:', movieObjId);
	readFirebase.getMovies(userID)
	.then((userMovies)=>readFirebase.parseFireBase(userMovies))
	.then((userMovies)=>{
		console.log('userMovies line 223:', userMovies);

	 	// let deleteKey = ;
	 	// removeUser.deleteMovie(deleteKey);
	});

	// $(this).closest(".card").remove();
	
	

}));


/*

Listens for when the user wants to sign out of their account, sign up, 
or a different user would like to sign in.
*/

$('.login-user').click(function(event) {
	createUser.logIn();
});

$('.logout-user').click(function(event) {
	createUser.logOut();
});

$('.get-user').click(function(event) {
	createUser.getUser();
});

















