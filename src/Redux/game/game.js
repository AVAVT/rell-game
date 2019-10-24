import * as api from '../../blockchain/api';
import auth from '../../blockchain/auth';
import {
  PENDING,
  REJECTED,
  FULFILLED
} from '../helpers';

export const ACTION_TYPES = {
  FETCH_STATUS: 'game/FETCH_STATUS',
  POST_MESSAGE: 'game/POST_MESSAGE'
}

export const getGameStatus = gameId => ({
  type: ACTION_TYPES.FETCH_STATUS,
  payload: api.getGameStatus(gameId)
})

export const postMessage = (gameId, message) => ({
  type: ACTION_TYPES.POST_MESSAGE,
  payload: api.postMessage(gameId, message),
  meta: {
    msg: {
      author_name: auth.getCurrentUser().username,
      message,
      timestamp: new Date().getTime()
    }
  }
})

const initialState = {
  loading: false,
  messages: [],
  game: {},
  pendingMessages: [],
  fulfilledMessages: [],
  sending: false,
  error: null
}


const reducer = (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case PENDING(ACTION_TYPES.FETCH_STATUS):
      return {
        ...state,
        loading: true,
        error: null
      }
    case FULFILLED(ACTION_TYPES.FETCH_STATUS):
      return {
        ...state,
        loading: false,
        game: payload.game,
        messages: payload.messages,
        fulfilledMessages: []
      }
    case REJECTED(ACTION_TYPES.FETCH_STATUS):
      return {
        ...state,
        loading: false,
        error: payload
      }
    case PENDING(ACTION_TYPES.POST_MESSAGE):
      return {
        ...state,
        sending: true,
        error: null,
        pendingMessages: [...state.pendingMessages, meta.msg]
      }
    case FULFILLED(ACTION_TYPES.POST_MESSAGE):
      return {
        ...state,
        sending: false,
        pendingMessages: state.pendingMessages.filter(msg => msg.message !== meta.msg.message),
        fulfilledMessages: [...state.fulfilledMessages, meta.msg]
      }
    case REJECTED(ACTION_TYPES.POST_MESSAGE):
      return {
        ...state,
        sending: false,
        pendingMessages: state.pendingMessages.filter(msg => msg.message !== meta.msg.message),
        error: payload
      }
    default: return state;
  }
}

export default reducer;