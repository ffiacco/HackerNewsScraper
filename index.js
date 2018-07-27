#!/usr/bin/env node

const program = require('commander');

program
  .version('0.0.1')
  .option('-p, --posts <required>','number of top posts to print')
  .parse(process.argv);

const rp = require('request-promise');
const cheerio = require('cheerio');
const pages = Math.ceil(program.posts/30);

for (let i = 1; i <= pages; i++){
    console.log("here");
    let options = {
        uri: `https://news.ycombinator.com/news?p=` + i,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    console.log(options.uri);

    rp(options)
    .then(($) => {
        $('td.title .storylink').map(function(num, el) {
            if (((i-1) * 30) + num < program.posts)
                console.log((i-1) * 30 + num + ": " + $(this).text());
        });
    })
    .catch((err) => {
        console.log(err);
    });
}
