import update from 'react-addons-update';

const ADD_EVENT = 'mymy/event/ADD_EVENT';
const REMOVE_EVENT = 'mymy/event/REMOVE_EVENT';
const MODIFY_EVENT = 'mymy/event/MODIFY_EVENT';
const ERROR_HAPPEN = 'mymy/event/ERROR_HAPPEN';

const initialState = {
  repeat: {},
  nonRepeat: {},
};

/**
 *
 * Calendar state structure:
 *
 * calendar: {
 *   error: error,
 *   repeat: {
 *     [startDate: string]: {
 *       events: [
 *         {
 *           name: [string],
 *           description: [string],
 *           repeatPeriod: [number],
 *           createDate: [dateObject],
 *           startDate: [dateObject],
 *           endDate: [dateObject],
 *         }, ...
 *       ]
 *     }
 *   },
 *   nonRepeat: {
 *     [startDate: string]: {
 *       events: [
 *         {
 *           name: [string],
 *           description: [string],
 *           createDate: [dateObject],
 *           startDate: [dateObject],
 *           endDate: [dateObject],
 *         }, ...
 *       ]
 *     }
 *   }
 * }
 *
 */

export default function calendar(state = initialState, action = {}) {
  switch (action.type) {
  case ADD_EVENT:
    if (!state[action.repeat ? 'repeat' : 'nonRepeat'][action.startDate]) {
      return update(state, {error: {$set: null}, [action.repeat ? 'repeat' : 'nonRepeat']: {[action.startDate]: {$set: {events: [action.data]}}}});
    }
    return update(state, {error: {$set: null}, [action.repeat ? 'repeat' : 'nonRepeat']: {[action.startDate]: {events: {$push: [action.data]}}}});
  case REMOVE_EVENT:
    return update(state, {error: {$set: null}, [action.repeat ? 'repeat' : 'nonRepeat']: {[action.startDate]: {events: {$splice: [[action.index, 1]]}}}});
  case MODIFY_EVENT:
    return update(state, {error: {$set: null}, $apply: (_state) => {
      const key = action.oldData.repeatPeriod ? 'repeat' : 'nonRepeat';
      const newKey = action.newData.repeatPeriod ? 'repeat' : 'nonRepeat';
      const index = _state[key][action.oldStartDateString].events.findIndex(el => el.createDate === action.oldData.createDate);
      if (~index) {
        _state[key][action.oldStartDateString].events.splice(index, 1);
        _state[newKey][action.newStartDateString].events.push({ ...action.oldData, ...action.newData});
      }
      return _state;
    }});
  default:
    return state;
  }
}

/**
 * addEvent
 * @param {object} data         {name: {string}, description: {string}, startDate: {Date}, repeatPeriod?: {one of: [0, 1, 2, 3] ~ [daily, weekly, monthly, yearly]}}
 * @param {number} repeatPeriod one of: [0, 1, 2, 3] ~ [daily, weekly, monthly, yearly]
 */
export function addEvent(data, repeatPeriod) {
  const _repeatPeriod = data.repeatPeriod || repeatPeriod;
  let _startDate;
  const date = data.startDate.getDate();
  const month = data.startDate.getMonth();
  switch (_repeatPeriod) {
  case 0:
    _startDate = `d`;
    break;
  case 1:
    _startDate = `${data.startDate.getDay()}`;
    break;
  case 2:
    _startDate = date > 9 ? `${date}` : `0${date}`;
    break;
  case 3:
    _startDate = `${date > 9 ? `${date}` : `0${date}`}${month > 9 ? `${month}` : `0${month}`}`;
    break;
  default:
    _startDate = data.startDate.toDateString();
    break;
  }
  return {
    type: ADD_EVENT,
    data: {
      createDate: new Date(),
      endDate: data.startDate,
      ...data,
      repeatPeriod: _repeatPeriod,
    },
    startDate: _startDate,
    repeat: !!_repeatPeriod,
  };
}

export function removeEvent(index, data) {
  return {
    type: REMOVE_EVENT,
    repeat: !!data.repeatPeriod,
    startDate: data.startDate.toDateString(),
    index,
  };
}

export function modifyEvent(oldData, oldStartDateString, newData, newStartDateString) {
  return {
    type: MODIFY_EVENT,
    oldData,
    newData,
    oldStartDateString,
    newStartDateString: newStartDateString || oldStartDateString,
  };
}

export function databaseError(err) {
  return { type: ERROR_HAPPEN, error: err};
}


