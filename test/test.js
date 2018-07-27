const assert = require('assert');
const scraper = require('../index');
var fs = require('fs');
const cheerio = require('cheerio');
var $ = cheerio.load(fs.readFileSync('./test.html'));


describe('Scrape', function() {
    describe('#notEmpty()', function() {
        it('should return a non empty array', function() {
            let promiseChain = [];
            let result = {
                articles: []
            };
            scraper.scrape(result, promiseChain, 1, 2, $);
            return Promise.all(promiseChain).then(() => {
                assert.notDeepStrictEqual(result.articles, []);
            })
        });
    });
    describe('#validTitle()', function() {
        it('should return the full title if less than 256 characters', function() {
            let promiseChain = [];
            let result = {
                articles: []
            };
            scraper.scrape(result, promiseChain, 1, 2, $);
            return Promise.all(promiseChain).then(() => {
                assert.deepStrictEqual(result.articles[0].title, "Transparent SLIs: See Google Cloud the way your application experiences it");
            })
        });
    });
    describe('#invalidTitle()', function() {
        it('should return a cut title if more than 256 characters', function() {
            let promiseChain = [];
            let result = {
                articles: []
            };
            scraper.scrape(result, promiseChain, 1, 2, $);
            return Promise.all(promiseChain).then(() => {
                assert.deepStrictEqual(result.articles[1].title, "How did Google get so big?How did Google get so big?How did Google get so big?How did Google get so big?How did Google get so big?How did Google get so big?How did Google get so big?How did Google get so big?How did Google get so big?How did Google get so ");
            })
        });
    });
    describe('#validAuthor()', function() {
        it('should return the full author if less than 256 characters', function() {
            let promiseChain = [];
            let result = {
                articles: []
            };
            scraper.scrape(result, promiseChain, 1, 2, $);
            return Promise.all(promiseChain).then(() => {
                assert.deepStrictEqual(result.articles[0].author, "markcartertm");
            })
        });
    });
    describe('#invalidAuthor()', function() {
        it('should return a cut author if more than 256 characters', function() {
            let promiseChain = [];
            let result = {
                articles: []
            };
            scraper.scrape(result, promiseChain, 1, 2, $);
            return Promise.all(promiseChain).then(() => {
                assert.deepStrictEqual(result.articles[1].author, "jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jonwachob91jon");
            })
        });
    });
    describe('#validURI()', function() {
        it('should return the URI if valid', function() {
            let promiseChain = [];
            let result = {
                articles: []
            };
            scraper.scrape(result, promiseChain, 1, 2, $);
            return Promise.all(promiseChain).then(() => {
                assert.deepStrictEqual(result.articles[0].uri, "https://cloudplatform.googleblog.com/2018/07/transparent-slis-see-google-cloud-the-way-your-application-experiences-it.html");
            })
        });
    });
    describe('#invalidURI()', function() {
        it('should return Invalid URI if the URI if valid', function() {
            let promiseChain = [];
            let result = {
                articles: []
            };
            scraper.scrape(result, promiseChain, 1, 2, $);
            return Promise.all(promiseChain).then(() => {
                assert.deepStrictEqual(result.articles[1].uri, "Invalid URI");
            })
        });
    });
    describe('#validRankPointsComments()', function() {
        it('should return the right rank, points and commands if greater than 0', function() {
            let promiseChain = [];
            let result = {
                articles: []
            };
            scraper.scrape(result, promiseChain, 1, 2, $);
            return Promise.all(promiseChain).then(() => {
                assert.deepStrictEqual(result.articles[0].rank, 1);
                assert.deepStrictEqual(result.articles[0].points, 60);
                assert.deepStrictEqual(result.articles[0].comments, 2);
            })
        });
    });
    describe('#invalidRankPointsComments()', function() {
        it('should return 0 if rank, points and commands are lesser than 0', function() {
            let promiseChain = [];
            let result = {
                articles: []
            };
            scraper.scrape(result, promiseChain, 1, 2, $);
            return Promise.all(promiseChain).then(() => {
                assert.deepStrictEqual(result.articles[1].rank, 0);
                assert.deepStrictEqual(result.articles[1].points, 0);
                assert.deepStrictEqual(result.articles[1].comments, 0);
            })
        });
    });
});