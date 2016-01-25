import { combineReducers } from 'redux';

import widget from './widget';
import link from './link';
import feed from './feed';
import calendar from './calendar';
import configuration from './configuration';

export default combineReducers({
  configuration,
  widget,
  link,
  feed,
  calendar,
});
