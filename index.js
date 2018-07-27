#!/usr/bin/env node

const program = require('commander');
const rp = require('request-promise');
const cheerio = require('cheerio');

program
  .version('0.0.1')
  .option('-p, --posts <required>','number of top posts to print')
  .parse(process.argv);

const pages = Math.ceil(program.posts/30);

let scrape = new Promise((resolve, reject) => {
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
    
        rp(options)
        .then(($) => {
            $('td.title .storylink').map(function(num, el) {
                if (((i-1) * 30) + num < program.posts){
                    result.articles.push({
                        title: $(this).text()
                    });
                }
                if (((i-1) * 30) + num < program.posts){
                    resolve(result);
                }
            });
        })
        .catch((err) => {
            console.log(err);
            reject("Couldn't scrape!");
        });
    }
});

scrape.then((result) => {
    console.log(JSON.stringify(result.articles));
});
