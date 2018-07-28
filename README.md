# HackerNewsScraper
A Node.js command line web scraper for HackerNews

## Requirements

The application requires Node.js version 6.4.0 and greater. if you do not have it installed, you can do so at: https://nodejs.org/en/

## Instllation

Once you have cloned this repository, navigate to its folder. In it, run:

`npm install`

This will install all external dependencies of the application.

## Execution

Inside the project folder, you can run the application with the command:

`hackernews --posts n`

where `n` is the number of top posts that you want to scrape.

## Tests

Inside the project folder, you can run the tests with the command:

`npm run test`

## Docker Installation

If you do not have Docker installed, you can do so at https://docs.docker.com/install/

To build a docker image containing the application, run in the project folder the command:

`docker build -t <image-name> .`

where `<image-name>` is a name of your choosing for the image.

Once built, you can run the image with the command:

`docker run -i -t --entrypoint /bin/bash <image-name>`

You will be moved into a bash and you can run the application with:

`./index.js --posts n`

## External Libraries

* request-promise
An http library that adds a .then() to Request calls leveraging Bluebird. It allows for http requests with the simplicity of Request with the added power of Promise functionality.

* commander
A library to easily creat command line interfaces in Node.js. A standards in its functionality, it makes adding options extremely easy.

* cheerio
Node.js implementation of JQuery functionality, allows easy web scraping with familiar syntax. The most widely used scraping library for Node.

* validator
A library to validate a number of types of inputs, I used it to validate URIs, as it is certainly more reliable than any regex i can come up with.

* mocha
One of the most popular testing frameworks for Javascript, comes with good support for promises, which I used extensively in the application.