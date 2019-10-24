import * as api from '../../blockchain/api';
import auth from '../../blockchain/auth';
import {
  PENDING,
  REJECTED,
  FULFILLED
} from '../helpers';

export const ACTION_TYPES = {
  RESET: 'lobby/RESET',
  FETCH_STATUS: 'lobby/FETCH_STATUS',
  LOOK_FOR_GAME: 'lobby/LOOK_FOR_GAME',
  STOP_LOOKING_FOR_GAME: 'lobby/STOP_LOOKING_FOR_GAME',
  JOIN_GAME: 'lobby/JOIN_GAME',
}

export const lookForGame = () => ({
  type: ACTION_TYPES.LOOK_FOR_GAME,
  payload: api.lookForGame()
})

export const stopLookingForGame = () => ({
  type: ACTION_TYPES.STOP_LOOKING_FOR_GAME,
  payload: api.stopLookingForGame()
})

export const joinGame = (userId) => ({
  type: ACTION_TYPES.JOIN_GAME,
  payload: api.joinGame(userId)
})

export const getLobbyStatus = () => ({
  type: ACTION_TYPES.FETCH_STATUS,
  payload: api.getLobbyStatus()
})

export const reset = () => ({
  type: ACTION_TYPES.RESET
})

const initialState = {
  loading: false,
  waitList: [],
  gameList: [],
  sending: false,
  isLookingForGame: false,
  error: null
}


const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case PENDING(ACTION_TYPES.FETCH_STATUS):
      return {
        ...state,
        loading: true,
        error: null
      };
    case FULFILLED(ACTION_TYPES.FETCH_STATUS):
      const waitList = payload.wait_list;
      const gameList = payload.game_list;
      return {
        ...state,
        loading: false,
        waitList,
        gameList,
        isLookingForGame: state.sending ? state.isLookingForGame : waitList.some(user => user.id === auth.getCurrentUser().id)
      };
    case REJECTED(ACTION_TYPES.FETCH_STATUS):
      return {
        ...state,
        loading: false,
        error: payload
      }
    case PENDING(ACTION_TYPES.LOOK_FOR_GAME):
      return {
        ...state,
        sending: true,
        isLookingForGame: true,
        error: null
      };
    case PENDING(ACTION_TYPES.STOP_LOOKING_FOR_GAME):
      return {
        ...state,
        sending: true,
        isLookingForGame: false,
        error: null
      };
    case FULFILLED(ACTION_TYPES.LOOK_FOR_GAME):
    case FULFILLED(ACTION_TYPES.STOP_LOOKING_FOR_GAME):
      return {
        ...state,
        sending: false
      };
    case REJECTED(ACTION_TYPES.LOOK_FOR_GAME):
    case REJECTED(ACTION_TYPES.STOP_LOOKING_FOR_GAME):
      return {
        ...state,
        sending: false,
        isLookingForGame: state.waitList.some(user => user.id === auth.getCurrentUser().id),
        error: payload
      }
    case PENDING(ACTION_TYPES.JOIN_GAME):
      return {
        ...state,
        sending: true,
        error: null
      };
    case REJECTED(ACTION_TYPES.JOIN_GAME):
      return {
        ...state,
        sending: false,
        error: payload
      };
    case ACTION_TYPES.RESET:
      return initialState;
    default:
      return state;
  }
}

export default reducer;