const UPDATE_FEED = 'mymy/feed/UPDATE_FEED';

const initialState = {
  'data': {},
};

export default function feed(state = initialState, action = {}) {
  switch (action.type) {
  case UPDATE_FEED:
    return {
      ...action.data,
    };
  default:
    return state;
  }
}

export function updateFeed(data) {
  return {
    type: UPDATE_FEED,
    data,
  };
}
