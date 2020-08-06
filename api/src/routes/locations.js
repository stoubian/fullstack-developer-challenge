import express from 'express';
import fs from 'fs';
import path from 'path';
import stringify from 'csv-stringify';
import _ from 'lodash';

import locations from '../models/locations';

const locationsRouter = express.Router();

locationsRouter.get('/', (req, res) => {
  const { query } = req;
  res.json(locations.find(query));
});

locationsRouter.get('/export', (req, res) => {
  const { query } = req;
  const data = locations.groupBy('countryCode');

  const formatedData = _.map(data, (country, key) => ({
    countryCode: key,
    number: country.length,
  }));

  writeDatatoCSV(formatedData);

  res.redirect('https://http.cat/201');
});

export default locationsRouter;

function writeDatatoCSV(data) {
  const csvStringifier = stringify();
  const handleStreamError = err => {
    console.error('💥️', err);
  };

  const filePath = path.join(
    process.cwd(),
    'data',
    'exportGroupedByCountry.csv'
  );

  const output = fs.createWriteStream(filePath);
  output.on('error', handleStreamError);

  csvStringifier.on('error', handleStreamError);
  csvStringifier.on('readable', () => {
    const row = csvStringifier.read();

    if (row) output.write(row);
  });

  csvStringifier.write(['countryCode', 'number']);

  data.forEach(country => {
    csvStringifier.write([country.countryCode, country.number]);
  });

  csvStringifier.end();
}
