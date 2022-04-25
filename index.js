require('dotenv').config();
const express = require('express');
const cron = require('./jobs/job');
const PORT = process.env.PORT;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: true, type: 'application/json'}));

app.get('/',(req,res) => {
  res.send('Welcome to the Medium scraper Server');
});

app.listen(PORT,() => {
  console.log(`Server listening on ${PORT}`);
});