#!/usr/bin/env node
//shebang to secify node interpreter

//require external libraries
const program = require('commander');
const rp = require('request-promise');
const cheerio = require('cheerio');
var validator = require('validator');

//specify and parse options from cli
program
  .version('0.0.1')
  .option('-p, --posts <required>','number of top posts to print', parseInt)
  .parse(process.argv);

//get title and uri of each article in the page, and append to the result array
let getTitleAndUri = ($, i, result, postNumber) => {
    $('td.title .storylink').map(function(num) {
        //we check that we haven't passed the number of posts requested
        if (((i-1) * 30) + num + 1 <= postNumber){
            //we check that the title is not empty, if so we write Title Unavaiable
            let title = ($(this).text() != "") ? $(this).text() : "Title Unavailable";
            //we check that the URI is valid, if not we write Invalid URI
            let uri = (validator.isURL($(this).attr('href'))) ? $(this).attr('href') : "Invalid URI";
            //finally, we add the title and the uri to the right article in the result array
            result.articles[((i-1) * 30) + num] = {
                //in case the title is longer than 256 characters, we cut it at the 256th
                title: (title.length <= 256) ? title : title.slice(0, 256),
                uri: uri
            };
        }
    });
}

//get author of each article in the page, and append to the result array
//checks are analogous to the title
let getAuthor = ($, i, result, postNumber) => {
    $('td.subtext .hnuser').map(function(num) {
        if (((i-1) * 30) + num + 1 <= postNumber){
            let author = ($(this).text() != "") ? $(this).text() : "Author Unavaiable";
            result.articles[((i-1) * 30) + num].author = (author.length <= 256) ? author : author.slice(0, 256);
        }
    });
}

//get points of each article in the page, and append to the result array
let getPoints = ($, i, result, postNumber) => {
    $('td.subtext .score').map(function(num) {
        if (((i-1) * 30) + num + 1 <= postNumber){
            let points = $(this).text().split(" ")[0];
            //we check that the points are  >= 0, if not we write 0, and the same for rank and comments
            result.articles[((i-1) * 30) + num].points = (points >= 0) ? parseInt(points) : 0;
        }
    });
}

//get comments of each article in the page, and append to the result array
//checks are analogous to th points
let getComments= ($, i, result, postNumber) => {
    $('td.subtext :nth-child(6)').map(function(num) {
        if (((i-1) * 30) + num + 1 <= postNumber){
            let comments = $(this).text().split(/\s{1}/)[0];
            result.articles[((i-1) * 30) + num].comments = (comments >= 0) ? parseInt(comments) : 0;
        }
    });
}

//get rank of each article in the page, and append to the result array
//checks are analogous to th points
let getRank = ($, i, result, postNumber) => {
    $('span.rank').map(function(num) {
        if (((i-1) * 30) + num + 1 <= postNumber){
            let rank = $(this).text().split(".")[0];
            result.articles[((i-1) * 30) + num].rank = (rank >= 0) ? parseInt(rank) : 0;
        }
    });
}

//scape page will simply call all the helper functions
var scrapePage = ($, i, result, postNumber) => {
    getTitleAndUri($, i, result, postNumber);
    getAuthor($, i, result, postNumber);
    getPoints($, i, result, postNumber);
    getComments($, i, result, postNumber);
    getRank($, i, result, postNumber);
}

var scrape = (result, promiseChain, pages, postNumber, test$) => {
    
    //for each page in the range necessary, we request the appropriate web page 
    for (let i = 1; i <= pages; i++){
        let options = {
            uri: `https://news.ycombinator.com/news?p=` + i,
            transform: function (body) {
                //we feed the page to the cheerio library in order to scrape it
                return cheerio.load(body);
            }
        };

        //create new promise to wait for the page to be retrieved by the external library
        let p = new Promise((resolve, reject) => {
            rp(options)
            .then(($) => {
                //when the page is loaded, the cheerio object that we can navigate is returned
                //we allow it to be overwritten via parameter for testing purposes
                $ = (test$) ? test$ : $;
                //for each page, we call the function that scrapes all authors, comments etc
                scrapePage($, i, result, postNumber);
                resolve("Success!");
            })
            .catch((err) => {
                console.log(err);
                reject("Couldn't scrape!");
            });
        });
        
        //to take care of asynchronous resolutions, each page corresponds to a promise
        //we will wait for all of them to resolve before returning the result to the user
        promiseChain.push(p);
    }
};

let run = () => {
    //calculate the number of pages of the website to go through
    const pages = Math.ceil(program.posts/30);

    let promiseChain = [];
    let result = {
        articles: []
    }
    
    //check the input is within the boundaries
    if (0 <= program.posts && program.posts <= 100){

        //call the function that handles scraping, which will populte the array of promises
        scrape(result, promiseChain, pages, program.posts);

        //only when all promises resolve, populating the array of articles, we print it
        Promise.all(promiseChain).then(() => {
            console.log(JSON.stringify(result.articles, null, '\t'));
        });

    }   
    else 
        //if not within boundaries, the program rejects it
        console.log("Invalid Input");
};

//entry point of the aplication, first function called
run();

module.exports = {
    scrape: scrape
};



