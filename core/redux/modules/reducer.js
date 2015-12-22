import { combineReducers } from 'redux';

import widget from './widget';
import link from './link';
import feed from './feed';

export default combineReducers({
  widget,
  link,
  feed,
});
