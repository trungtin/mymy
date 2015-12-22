import * as widgetActions from '../../../core/redux/modules/widget';
import union from 'lodash.union';

let db;
if (typeof window !== 'undefined') {
  db = new window.PouchDB('mymy-db');
}

export function addLinkToWidget(dispatch, target, targetTab, data, dataAddToState) {
  if (!Array.isArray(data) || !Array.isArray(dataAddToState)) {
    throw Error('Data which be added to widget must be an array of link.');
  }
  return db && db.get('widget').then(doc => {
    doc.data[target].data[targetTab].data = union(doc.data[target].data[targetTab].data, data);
    return db.put(doc);
  }).then(response => {
    if (response.ok === true) {
      return;
    } else {
      throw Error('Error while put new link to local database');
    }
  }).then(() => {
    dispatch(widgetActions.addLink(target, targetTab, dataAddToState));
  }).catch(err => console.log(err));
}
