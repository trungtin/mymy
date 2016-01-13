import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import request from 'superagent';

/**
 *
 * Update `link` and `feed` document of database
 *
 */
export async function updateDB(db, result, onUpdated) {
  let _result, _db;
  if (!db) {
    _db = new window.PouchDB('mymy-db');
  } else {
    _db = db;
  }
  const userLink = await _db.get('link').catch(getErr => window.console.log('Local link is not found: ', getErr));
  const userFeed = await _db.get('feed').catch(getErr => window.console.log('Local feed is not found: ', getErr));
  if (userLink && userLink.updatedAt + 86400000 > Date.now() && userFeed && userFeed.updatedAt + 86400000 > Date.now()) {
    // return Promise.resolve({message: 'No need to update'});
  }

  if (!result) {
    try {
      _result = await new Promise((res, rej) => {
        request.get('/api/index.json').set('Accept', 'application/json').end((err, response) => {
          if (err) return rej(err);
          return res(response);
        });
      });
    } catch (err) {
      window.console.log('Cannot update database: ', err);
    }
  } else {
    _result = result;
  }
  return _db.bulkDocs([{
    _id: 'link',
    _rev: userLink ? userLink._rev : undefined,
    ...(userLink || {}).data,
    ..._result.body.link,
    updatedAt: Date.now(),
  },
  {
    _id: 'feed',
    _rev: userFeed ? userFeed._rev : undefined,
    ...(userFeed || {}).data,
    ..._result.body.feed,
    updatedAt: Date.now(),
  }]).then(response => {if (onUpdated) onUpdated(response, _result.body.link || userLink, _result.body.feed || userFeed);});
}


/**
 *
 * Sync `widget` document of database
 *
 */
async function syncDB() {
  const db = new window.PouchDB('mymy-db');
  return new Promise((res, rej) => {
    request.get('/api/index.json')
    .set('Accept', 'application/json')
    .end((error, result) => {
      if (error) {
        return rej(error);
      }
      return db.put({
        _id: 'widget',
        ...result.body.widget,
      })
      .then(() => {
        return updateDB(db, result);
      })
      .catch((dbErr) => {
        window.console.log('There was an error with database: ', dbErr);
      })
      .then(response => res({...response, ...result.body.widget}));
    });
  }).catch(fetchError => {window.console.log('Fetch data error: '); window.console.log(fetchError);});
}

export async function getInitialState() {
  if (canUseDOM) {
    const db = new window.PouchDB('mymy-db');
    return db.get('widget').catch(err => {
      if (err) window.console.log('No client data found, fetching from server...', err);
      return syncDB();
    }).then(doc => {
      return db.get('configuration').then(conf => [doc, conf]).catch(() => Promise.resolve([doc, {}]));
    }).then(docs => {
      console.log('----', docs, '----');
      const storeInitialState = {widget: docs[0], configuration: docs[1]};
      return storeInitialState;
    }).catch(err => window.console.log('Database error: ', err));
  } else {
    return Promise.resolve({});
  }
}
