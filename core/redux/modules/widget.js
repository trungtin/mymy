import update from 'react-addons-update';
import union from 'lodash.union';

const EDIT_SIZE = 'mymy/widget/EDIT_SIZE';
const ADD_WIDGET = 'mymy/widget/ADD_WIDGET';
const ADD_LINK = 'mymy/widget/ADD_LINK';
const ADD_TAB = 'mymy/widget/ADD_TAB';
const REMOVE_WIDGET = 'mymy/widget/REMOVE_WIDGET';
const REMOVE_TAB = 'mymy/widget/REMOVE_TAB';
const REMOVE_LINK = 'mymy/widget/REMOVE_LINK';
const RENAME_TAB = 'mymy/widget/RENAME_TAB';
const ERROR_HAPPEN = 'mymy/widget/ERROR_HAPPEN';


const initialState = {
  data: {},
};

export default function widget(state = initialState, action = {}) {
  if (!action.type.startsWith('@@') && action.type !== ADD_WIDGET && !action.target) {
    console.log('Error happen, ', action);
    return {...state, error: 'Target required'};
  }

  if (!action.target && !action.targetTab && ~[ADD_LINK, REMOVE_LINK, RENAME_TAB, REMOVE_TAB].indexOf(action.type)) {
    return {...state, error: 'Target and target tab required'};
  }

  switch (action.type) {
  case EDIT_SIZE:
    const newSize = state[action.target].size + action.data;
    if (Math.floor(newSize / 10) < 1 || Math.floor(newSize / 10) > 3 || newSize % 10 < 1 || newSize % 10 > 4) {
      return state;
    }
    return update(state, {error: {$set: null}, data: {[action.target]: {size: {$set: newSize}}}});

  case ADD_LINK:
    return update(state, {error: {$set: null}, data: {[action.target]: {data: {[action.targetTab]: {data: {$apply: (array) => union(array, action.data)}}}}}});

  case REMOVE_LINK:
    return update(state, {error: {$set: null}, data: {[action.target]: {data: {[action.targetTab]: {data: {$unshift: action.data}}}}}});

  case ADD_TAB:
    return update(state, {error: {$set: null}, data: {[action.target]: {data: {$merge: {[action.targetTab]: action.data}}}}});

  case RENAME_TAB:
    return update(state, {error: {$set: null}, data: {[action.target]: {data: {$apply: (oldData) => {
      let newData;
      Object.keys(oldData).forEach(oldKey => {
        if (oldKey === action.targetTab) {
          newData[action.data] = oldData[oldKey];
        } else {
          newData[oldKey] = oldData[oldKey];
        }
      });
      return newData;
    }}}}});

  case REMOVE_TAB:
    return update(state, {error: {$set: null}, data: {[action.target]: {data: {$apply: (oldData) => {
      const newData = {};
      Object.keys(oldData).forEach(oldKey => {
        if (oldKey !== action.targetTab) {
          newData[oldKey] = oldData[oldKey];
        }
      });
      return newData;
    }}}}});

  case ADD_WIDGET:
    if (state.data[action.target]) {
      return update(state, {error: {$set: null}, data: {$apply: (data) => {
        let index = action.target;
        const newData = {[index]: action.data};
        while (data[index]) {
          newData[index + 1] = data[index];
          index++;
        }
        return {...data, ...newData};
      }}});
    }
    return update(state, {error: {$set: null}, data: {[action.target]: {$set: action.data}}});
  case REMOVE_WIDGET:
    return update(state, {error: {$set: null}, data: {$apply: (oldData) => {
      let newData = {};
      Object.keys(oldData).forEach(oldKey => {
        if (oldKey !== action.target) {
          newData[oldKey] = oldData[oldKey];
        }
      });
      return newData;
    }}});
  case ERROR_HAPPEN:
    return {...state, error: action.error};
  default:
    return state;
  }
}

/**
 *
 * Edit widget size
 * @params{data:number} +10/-10 for increase/decrease one row, +1/-1 for increase/decrease one collumn
 *
 */
export function editSize(data) {
  return { type: EDIT_SIZE, data};
}

/**
 *
 * Add link(s) to a tab
 * @params{target:string, [targetTab]: string, data}
 *
 */
export function addLink(target, targetTab, data) {
  return { type: ADD_LINK, target, targetTab, data};
}

export function removeLink(target, targetTab, data) {
  return { type: REMOVE_LINK, target, targetTab, data};
}

export function addTab(target, targetTab, data) {
  return { type: ADD_TAB, target, targetTab, data};
}

export function removeTab(target, targetTab) {
  return { type: REMOVE_TAB, target, targetTab};
}

/**
 *
 * Rename a tab.
 * @params{target:string, targetTab:string, data:string}
 * data is new name for tab.
 *
 */
export function renameTab(target, targetTab, data) {
  return { type: RENAME_TAB, target, targetTab, data};
}

export function addWidget(target, data) {
  return { type: ADD_WIDGET, target, data};
}

export function removeWidget(target) {
  return { type: REMOVE_WIDGET, target};
}


export function databaseError(err) {
  return { type: ERROR_HAPPEN, error: err};
}
