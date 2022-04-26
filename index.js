require('dotenv').config();
const express = require('express');
const cors = require('cors');

const scrapeJob = require('./jobs/scrape');
const postRoutes = require('./routes/post');

const PORT = process.env.PORT || 8000;


const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: true, type: 'application/json'}));
app.use(cors({credentials: true, origin: true}));

app.use('/',postRoutes);

app.get('/',(req,res) => {
  res.send('Welcome to the Medium scrapper Server');
});

app.listen(PORT,() => {
  console.log(`Server listening on ${PORT}`);
});