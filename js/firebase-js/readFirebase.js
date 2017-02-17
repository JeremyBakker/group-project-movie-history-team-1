"use strict";

let firebase = require("./configFirebase");

// specifying userID to sort movie per that specific user
function getMovies(userID) {
	console.log("getMovies");
	return new Promise( function (resolve, reject){
		console.log("beforeajax");
		$.ajax({
			url: `https://group-project-b2ed0.firebaseio.com/movies.json?orderBy="uid"&equalTo="${userID}"`,
		}).done( function(userMovies){
			console.log('userMovies:', userMovies);
			resolve(userMovies);
		});
	});
}

function parseFireBase(userMovies) {
	return new Promise(function (resolve, reject){
		let idArray = Object.keys(userMovies);
		idArray.forEach((movie)=>{
	         userMovies[movie].key = movie;
	         console.log('movie:', movie);
	         console.log('userMovies[movie]:', userMovies[movie]);
	         console.log('userMovies[movie].key:', userMovies[movie].key);
		});
	 	resolve(userMovies);
	});
}

module.exports = {getMovies, parseFireBase};



