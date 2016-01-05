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
    if (response.ok !== true) {
      throw Error('Error while put new link to widget');
    }
  }).then(() => {
    dispatch(widgetActions.addLink(target, targetTab, dataAddToState));
  }).catch(err => dispatch(widgetActions.databaseError(err)));
}

export function addTabToWidget(dispatch, target, targetTab, data, dataAddToState) {
  return db && db.get('widget').then(doc => {
    if (doc.data[target].data[targetTab]) {
      throw Error('There is existing tab with same name .');
    }
    doc.data[target].data[targetTab] = data;
    return db.put(doc);
  }).then(response => {
    if (response.ok !== true) {
      throw Error('Error while add new tab to widget');
    }
  }).then(() => {
    dispatch(widgetActions.addTab(target, targetTab, dataAddToState));
  }).catch(err => dispatch(widgetActions.databaseError(err)));
}

export function removeTab(dispatch, target, targetTab) {
  return db && db.get('widget').then(doc => {
    delete doc.data[target].data[targetTab];
    return db.put(doc);
  }).then(response => {
    if (response.ok !== true) {
      throw Error('Error while remove tab');
    }
  }).then(() => {
    dispatch(widgetActions.removeTab(target, targetTab));
  }).catch(err => dispatch(widgetActions.databaseError(err)));
}

export function addWidget(dispatch, data) {
  let index = 0;
  db && db.get('widget').then(doc => {
    while (doc.data[index]) {
      index++;
    }
    doc.data[index] = data;
    return db.put(doc);
  }).then(response => {
    if (response.ok !== true) {
      throw Error('Error while add new widget');
    }
  }).then(() => {
    dispatch(widgetActions.addWidget(index, data));
  }).catch(err => dispatch(widgetActions.databaseError(err)));
}

export function removeWidget(dispatch, widget) {
  db && db.get('widget').then(doc => {
    delete doc.data[widget];
    return db.put(doc);
  }).then(response => {
    if (response.ok !== true) {
      throw Error('Error while add new widget');
    }
  }).then(() => {
    dispatch(widgetActions.removeWidget(widget));
  }).catch(err => dispatch(widgetActions.databaseError(err)));
}

export function editWidgetSize(dispatch, widget, newSize) {
  db && db.get('widget').then(doc => {
    doc.data[widget].size = newSize;
    return db.put(doc);
  }).then(response => {
    if (response.ok !== true) {
      throw Error('Error while add new widget');
    }
  }).then(() => {
    dispatch(widgetActions.editSize(widget, newSize));
  }).catch(err => dispatch(widgetActions.databaseError(err)));
}
