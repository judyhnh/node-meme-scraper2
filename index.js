import fs from 'node:fs';
import * as cheerio from 'cheerio';
import logUpdate from 'log-update';
import request from 'request';

request(
  'https://memegen-link-examples-upleveled.netlify.app/',
  (error, response, html) => {
    if (!error && response.statusCode === 200) {
      console.log('Request OK');

      // Fetch url and push into array
      const array = [];
      const $ = cheerio.load(html);

      $('img').each((index, image) => {
        const img = $(image).attr('src');

        array.push(img);
      });
      // Get first ten url
      const firstTens = array.slice(0, 10);

      // Loop through each url
      for (let i = 0; i < firstTens.length; i++) {
        const url = firstTens[i];

        const end = [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
        ];

        // Create non existing path
        const path = `./memes/${end[i]}.jpg`;

        fs.mkdir('./memes', { recursive: true }, (err) => {
          if (err) throw err;
        });

        // Download url to folder
        const download = (urls, paths, callback) => {
          request.head(url, () => {
            request(url).pipe(fs.createWriteStream(path)).on('close', callback);
          });
        };
        download(url, path, () => {
          console.log('Quak!');
        });
      }
    } else {
      console.log('Request not fulfilled.');
    }
  },
);

// A nice progress bar

const char = '🦆';
const max = 100;
const steps = 10;
let num = 1;

const mInterval = setInterval(() => {
  let progress = '';
  for (let i = 0; i < num; i++) {
    progress += char;
  }
  const progressString = `Loading: [ ${progress} ] \n ${num * steps}%`;
  logUpdate(progressString);
  num++;
  if (num > max / steps) {
    logUpdate.done();
    clearInterval(mInterval);
  }
}, 300);
