require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const scrapeJob = require('./jobs/scrape');
const postRoutes = require('./routes/post');

const PORT = process.env.PORT;


const app = express();


const URL = process.env.MONGODB_URI;
// Connect to mongoDb
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.log('Cannot connect to database:', err);
  });
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