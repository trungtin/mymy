const SET_BACKGROUND = 'mymy/configuration/SET_BACKGROUND';

const initialState = {
  background: '',
};

export default function configuration(state = initialState, action = {}) {
  switch (action.type) {
  case SET_BACKGROUND:
    return {
      ...state,
      background: action.data,
    };
  default:
    return state;
  }
}

export function setBackground(data) {
  return {
    type: SET_BACKGROUND,
    data,
    dbTable: 'configuration',
    dbTableLookup: ['background'],
  };
}
