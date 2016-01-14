export default function databaseMiddleware({dispatch, getState}) {
  let db;
  if (typeof window !== 'undefined') {
    db = new window.PouchDB('mymy-db');
  }
  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { dbTable, dbTableLookup, type, data, mergeFunction, errorAction, ...rest } = action; // eslint-disable-line no-redeclare

    if (!dbTable) {
      return next(action);
    }

    db && db.get(dbTable).catch(() => ({_id: dbTable})).then(doc => {
      if (typeof mergeFunction === 'function') {
        const _doc = mergeFunction(doc);
        return db.put(_doc);
      }
      if (data === null) {
        delete dbTableLookup.slice(0, -1).reduce((prev, cur) => {
          if (!prev[cur]) {
            prev[cur] = {};
          }
          return prev[cur];
        }, doc)[dbTableLookup.slice(-1)];
      }
      dbTableLookup.slice(0, -1).reduce((prev, cur) => prev[cur], doc)[dbTableLookup.slice(-1)] = data;
      return db.put(doc);
    }).then(response => {
      if (response.ok !== true) {
        console.log('Error in action: ', type);
        errorAction && dispatch(errorAction);
      }
    });

    return next(action);
  };
}
