#!/usr/bin/env node

const program = require('commander');
const rp = require('request-promise');
const cheerio = require('cheerio');
var validator = require('validator');

program
  .version('0.0.1')
  .option('-p, --posts <required>','number of top posts to print', parseInt)
  .parse(process.argv);

let getTitleAndUri = ($, i, result) => {
    $('td.title .storylink').map(function(num) {
        if (((i-1) * 30) + num + 1 <= program.posts){
            let title = ($(this).text() != "") ? $(this).text() : "Title Unavailable";
            let uri = (validator.isURL($(this).attr('href'))) ? $(this).attr('href') : "Invalid URI";
            result.articles[((i-1) * 30) + num] = {
                title: (title.length <= 256) ? title : title.slice(0, 256),
                uri: uri
            };
        }
    });
}

let getAuthor = ($, i, result) => {
    $('td.subtext .hnuser').map(function(num) {
        if (((i-1) * 30) + num + 1 <= program.posts){
            let author = ($(this).text() != "") ? $(this).text() : "Author Unavaiable";
            result.articles[((i-1) * 30) + num].author = (author.length <= 256) ? author : author.slice(0, 256);
        }
    });
}

let getPoints = ($, i, result) => {
    $('td.subtext .score').map(function(num) {
        let points = $(this).text().split(" ")[0];
        if (((i-1) * 30) + num + 1 <= program.posts){
            result.articles[((i-1) * 30) + num].points = (points >= 0) ? points : 0;
        }
    });
}

let getComments= ($, i, result) => {
    $('td.subtext :nth-child(6)').map(function(num) {
        let comments = $(this).text().split(/\s{1}/)[0];
        if (((i-1) * 30) + num + 1 <= program.posts){
            result.articles[((i-1) * 30) + num].comments = (comments >= 0) ? comments : 0;
        }
    });
}

let getRank = ($, i, result) => {
    $('span.rank').map(function(num) {
        let rank = $(this).text().split(".")[0];
        if (((i-1) * 30) + num + 1 <= program.posts){
            result.articles[((i-1) * 30) + num].rank = (rank >= 0) ? rank : 0;
        }
    });
}

var scrape = (promiseChain, pages) => {
    let result = {
        articles: []
    }
    for (let i = 1; i <= pages; i++){
        let options = {
            uri: `https://news.ycombinator.com/news?p=` + i,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        let p = new Promise((resolve, reject) => {
            rp(options)
            .then(($) => {
                getTitleAndUri($, i, result);
                getAuthor($, i, result);
                getPoints($, i, result);
                getComments($, i, result);
                getRank($, i, result);
                
                resolve("Success!");
            })
            .catch((err) => {
                console.log(err);
                reject("Couldn't scrape!");
            });
        });
    
        promiseChain.push(p);
    }

    return result;
};

let run = () => {
    const pages = Math.ceil(program.posts/30);
    let promiseChain = [];
    if (0 <= program.posts && program.posts <= 100){
        let result = scrape(promiseChain, pages);
        Promise.all(promiseChain).then(() => {
            console.log(JSON.stringify(result.articles, null, '\t'));
        });
    }   
    else 
        console.log("Invalid Input");
};

run();



