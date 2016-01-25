// import request from 'superagent';
// import FeedParser from 'feedparser';
// import strToStream from 'string-to-stream';

export default function fetchFeed(feedUrl) {
  // const parser = new FeedParser();
  // const feed = {data: [], fetchedAt: Date.now()};
  // return new Promise(resolve => {
  //   request.get(feedUrl).withCredentials()
  //     .end((err, res) => {
  //       if (err) {
  //         return console.log('Request feed data error: ', err);
  //       }
  //       strToStream(res.text).pipe(parser);
  //     });
  //   parser
  //     .on('error', (error) => {
  //       console.log('Parse feed error: ', error);
  //     })
  //     .on('readable', function parserReadable() {
  //       const stream = this;
  //       // const meta = this.meta;
  //       let item = stream.read();

  //       while (item) {
  //         feed.data.push(item);
  //         item = stream.read();
  //       }
  //     })
  //     .on('end', () => {
  //       feed.url = feedUrl.match(/\/\/(.*?)(\/|$)/)[1] + '/';
  //       resolve(feed);
  //     });
  // });
  return new Promise((resolve, reject) => {
    feednami.load(feedUrl, result => { // eslint-disable-line no-undef
      if (result.error) {
        reject(result.error);
      } else {
        const feed = {data: result.feed.entries, meta: result.feed.meta, fetchedAt: Date.now()};
        resolve(feed);
      }
    });
  });
}
