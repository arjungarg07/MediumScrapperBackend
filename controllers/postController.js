const Scraper = require('../scraper');
const {commonQuery} = require('../db');

class postController{
    // Get all posts
    async getPostsByTag(req, res) {
        try {
            const tag = req.params.tag;
            // get latest 10 posts from db with tag
            const scraper = new Scraper({concurrencyLimit: 5, delay: 200, tags: [tag] });
            // scraper.start();
            const query = `SELECT * FROM medium_scraper.posts WHERE tags LIKE '%${tag}%' ORDER BY latestPublishedAt DESC LIMIT 10`;
            const results = await commonQuery(query);
            // start scraper
            res.send(results);
        } catch (err) {
            console.log(err);
            res.status(500).json({status: 0, msg: 'Internal Server Error'});
        }
    }
}
module.exports = new postController();