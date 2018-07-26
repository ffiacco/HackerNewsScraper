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
        console.log(i + ": " + $(this).text());
      });
  })
  .catch((err) => {
    console.log(err);
});