const { default: axios } = require("axios");
const cheerio = require("cheerio");
const { commonQuery } = require('./db');

class Scraper {
    populateSeedUrls(){
        this.tags.forEach(tag => {
            // replace space with - 
            this.seedUrls.push(`https://medium.com/tag/${tag.toLowerCase().replace(/ /g, '-')}`);
        });
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
      

    sleep(delay) {
        return new Promise(resolve=>setTimeout(()=>resolve(1), delay));
    }

    constructor(settings) {
        const { 
            concurrencyLimit = 10,
            delay = 1000,
            tags = ['self']
        } = settings || {};
        this.tags = tags;
        this.seedUrls = [];
        this.delay = delay;
        this.concurrencyLimit = concurrencyLimit;
        this.seedPointer = 0;
    }

    saveNewSeedUrls(tagSet){
        tagSet.forEach(tag => {
            this.seedUrls.push(`https://medium.com/tag/${tag.toLowerCase()}`);
        });
    }

    async saveDataInDB(data){
        // iterate on data and convert tags array in data to string
        data.forEach(item => {
            item.tags = item.tags.join(',');
        });
        try{
            const insertQuery = 'INSERT INTO medium_scraper.posts (title, url, clapCount, author, tags, latestPublishedAt, readingTime, subtitle) VALUES (?,?,?,?,?,?,?,?)';
            console.log(data);
            for(let i=0;i<data.length;i++){
                const result = await commonQuery(insertQuery,[data[i].title,data[i].url,data[i].clapCount,data[i].author,data[i].tags,data[i].latestPublishedAt, data[i].readingTime, data[i].subtitle]);
                console.log(result);
            }
        } catch(err){
            console.log(err);
        }
    }

    async fetchData(response){
        try {
            let windowData = response?.data.match(/window.__APOLLO_STATE__ = (.*)/);
            let currpageData = windowData[0]?.replace(/<script[^>]*>([\s\S]*?)<\/script>/g, '');
            currpageData = currpageData.replace(/<\/script>/g, '');
            currpageData = currpageData.replace(/window.__APOLLO_STATE__ = /g, '');
            let json = JSON.parse(currpageData);
            let jsonKeys = Object.keys(json);
            let postIds = jsonKeys.filter(item => item.startsWith('Post'));
            let userIds = jsonKeys.filter(item => item.startsWith('User'));
            let tagSet = new Set();
            let finalData = [];
            postIds.forEach(postId => {
                let postIdData = json[postId];
                let postKeys = Object.keys(postIdData);
                let contentId = postKeys.filter(item => item.startsWith('extendedPreviewContent'));
                let content = postIdData[contentId[0]];
                console.log(content);
                let userId = postIdData.creator.__ref;
                let userData = json[userId];
                let currentTags = [];
                postIdData.tags.forEach(tag => {
                    tagSet.add(tag.__ref.replace(/Tag:/g, ''));
                    currentTags.push(tag.__ref.replace(/Tag:/g, ''));
                });
                console.log(postIdData);
                finalData.push({
                    latestPublishedAt: new Date(postIdData.latestPublishedAt),
                    title: postIdData.title,
                    url: postIdData.mediumUrl,
                    clapCount: postIdData.clapCount,
                    author: userData.name,
                    tags: currentTags,
                    readingTime: postIdData.readingTime,
                    subtitle: content.subtitle,
                })
            });
            // console.log(finalData);
            this.saveNewSeedUrls(tagSet);
            // console.log(tagUrls);
            await this.saveDataInDB(finalData);
        } catch (err) {
            console.log(err);
            return;
        }
    }
    async recursiveFetch() {
        try {
            if (this.seedPointer === this.seedUrls.length) {
              return;
            }

            const currentUrl = this.seedUrls[this.seedPointer++];
            console.log(currentUrl);
            this.requestCount++;
            const response = await axios.get(currentUrl);
            this.requestCount--;
            await this.fetchData(response);
            // await this.sleep(this.delay + this.getRandomArbitrary(100, 500)); // uncomment it to simulate human behaviour
            this.recursiveFetch();

            return;
        } catch(err){
            console.log(err);

            return;
        }
    }

    async start(){
        this.populateSeedUrls();

        for (let i=0; i<this.concurrencyLimit;i++) {
            this.recursiveFetch();
        }
    }
}

module.exports = Scraper;