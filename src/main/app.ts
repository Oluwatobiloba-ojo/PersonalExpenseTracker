import express from 'express';
import initializeDataSource from './config/data_source';

const app = express();
const port =  3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, async() => {
  await initializeDataSource();

  console.log(`Express is listening at http://localhost:${port}`);
});