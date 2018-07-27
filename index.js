#!/usr/bin/env node

const program = require('commander');
const rp = require('request-promise');
const cheerio = require('cheerio');

program
  .version('0.0.1')
  .option('-p, --posts <required>','number of top posts to print')
  .parse(process.argv);

const pages = Math.ceil(program.posts/30);
let promiseChain = [];
let result = {
    articles: []
}

let scrape = () => {
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
                $('td.title .storylink').map(function(num) {
                    if (((i-1) * 30) + num + 1 <= program.posts){
                        result.articles[((i-1) * 30) + num] = {
                            title: $(this).text(),
                            uri: $(this).attr('href')
                        };
                    }
                });
                $('td.subtext .hnuser').map(function(num) {
                    if (((i-1) * 30) + num + 1 <= program.posts){
                        result.articles[((i-1) * 30) + num].author = $(this).text();
                    }
                });
                $('td.subtext .score').map(function(num) {
                    if (((i-1) * 30) + num + 1 <= program.posts){
                        result.articles[((i-1) * 30) + num].points = $(this).text().split(" ")[0];
                    }
                });
                
                $('td.subtext :nth-child(6)').map(function(num) {
                    if (((i-1) * 30) + num + 1 <= program.posts){
                        result.articles[((i-1) * 30) + num].comments = $(this).text().split("&")[0];
                        result.articles[((i-1) * 30) + num].rank = (i-1) * 30 + num + 1;
                    }
                });
                resolve("Success!");
            })
            .catch((err) => {
                console.log(err);
                reject("Couldn't scrape!");
            });
        });
    
        promiseChain.push(p);
    }
};

scrape();

Promise.all(promiseChain).then(() => {
    console.log(JSON.stringify(result.articles, null, '\t'));
})
