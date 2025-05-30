import express from 'express';
import initializeDataSource from './config/data_source';
import { createUserMappings } from './mapper/user_mapper';
import config from './config/configuration';


const app = express();
const port =  config.PORT;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, async() => {
  await initializeDataSource();
  createUserMappings();

  console.log(`Express is listening at http://localhost:${port}`);
});



