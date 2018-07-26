#!/usr/bin/env node

const program = require('commander');

program
  .version('0.0.1')
  .option('-p, --posts <required>','number of top posts to print')
  .parse(process.argv);

const rp = require('request-promise');
const cheerio = require('cheerio');

const options = {
    uri: `https://news.ycombinator.com/news?p=`,
    transform: function (body) {
        return cheerio.load(body);
    }
};

rp(options)
  .then(($) => {
    $('td.title .storylink').map(function(i, el) {
        if (i < program.posts)
            console.log(i + ": " + $(this).text());
      });
  })
  .catch((err) => {
    console.log(err);
});