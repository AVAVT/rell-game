export const ACTION_TYPES = {
  SET_NODE_LOCATION: 'config/SET_NODE_LOCATION'
}

export const setNodeLocation = uri => ({
  type: ACTION_TYPES.SET_NODE_LOCATION,
  payload: uri
});


const reducer = (state = {}, { type, payload, ...others }) => {
  switch (type) {
    case ACTION_TYPES.SET_NODE_LOCATION:
      window.localStorage.setItem('nodeLocation', payload);
      return {
        ...state,
        nodeLocation: payload
      }
    default:
      return state;
  }
}

export default reducer;