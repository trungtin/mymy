const UPDATE_LINK = 'mymy/link/UPDATE_LINK';

const initialState = {
  'google': {},
};

export default function link(state = initialState, action = {}) {
  switch (action.type) {
  case UPDATE_LINK:
    return {
      ...action.data,
    };
  default:
    return state;
  }
}

export function updateLink(data) {
  return {
    type: UPDATE_LINK,
    data,
  };
}
