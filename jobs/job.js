const Scraper = require('../scraper');
const { commonQuery } = require('../db');

const query1 = `CREATE DATABASE IF NOT EXISTS medium_scraper`;
const query2 = `CREATE TABLE IF NOT EXISTS medium_scraper.posts (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), url VARCHAR(255), 
clapCount INT, author VARCHAR(255), tags VARCHAR(255), latestPublishedAt DATETIME)`;

const mediumScrapper = new Scraper({pageLimitForSeedUrls: 20, concurrenyLimit: 5, delay: 200 });

( async()=>{
    try{
        const query1result = await commonQuery(query1);
        const query2result = await commonQuery(query2);
        console.log(query1result);
        console.log(query2result);
        mediumScrapper.start();
    }catch(err){
        console.log(err);
        throw(err);
    }
})();
