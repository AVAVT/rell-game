import { isEmpty } from 'lodash';

import * as api from '../../blockchain/api';
import auth from '../../blockchain/auth';
import {
  PENDING,
  REJECTED,
  FULFILLED
} from '../helpers';

import {
  newGame,
  loadGame,
  createCardCodeWords,
  initialShuffle,
  shuffleDeck,
  encryptCards,
  getSelf,
  updateOpponentDecrypts,
  decryptCardToName
} from '../../blockchain/game-logic';

export const ACTION_TYPES = {
  RESET: 'game/RESET',
  FETCH_STATUS: 'game/FETCH_STATUS',
  FETCH_FRAGMENTS: 'game/FETCH_FRAGMENTS',
  POST_MESSAGE: 'game/POST_MESSAGE',
  PASS_SHUFFLED_DECK: 'game/PASS_SHUFFLED_DECK',
  PLACE_BET: 'game/PLACE_BET',
  READY_FOR_NEXT_ROUND: 'game/READY_FOR_NEXT_ROUND',
  HIT: 'game/HIT',
  STAND: 'game/STAND',
  RESIGN: 'game/RESIGN'
}

export const PENDING_TYPES = {
  PASS_SHUFFLED_DECK: 'game/PASS_SHUFFLED_DECK',
  PLACE_BET: 'game/PLACE_BET'
}

export const getGameStatus = gameId => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.FETCH_STATUS,
    payload: api.getGameStatus(gameId)
  });

  const newGameState = result.value;
  if (isPlayer1(newGameState.game) || isPlayer2(newGameState.game)) {
    const state = getState().game;
    performAutomatedResponse(dispatch, state, gameId, result.value);
  }

  return result;
}

export const getCardFragments = gameId => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.FETCH_FRAGMENTS,
    payload: api.getCardFragments(gameId)
  });

  const data = result.value;
  const state = getState().game;

  const currentUser = auth.getCurrentUser();
  var self = getSelf();
  if (isEmpty(self)) {
    const cachedData = JSON.parse(localStorage.getItem(`gameSecrets_${currentUser.id}`) || '{}');
    const dataCached = !isEmpty(cachedData) && cachedData.gameId === state.game.id;
    const data = dataCached
      ? loadGame(cachedData.self, cachedData.config)
      : newGame();
    self = data.self;

    if (!dataCached) {
      localStorage.setItem(`gameSecrets_${currentUser.id}`, JSON.stringify({ self: data.self, config: data.config, gameId: state.game.id }));
    }
  }

  if (isEmpty(data[state.myPlayerIndex])) {
    // Our card fragments is not on the server
    try {
      api.postCardFragments(state.game.id, self.cardCodewordFragments);
    }
    catch (e) {
      console.error(e);
      alert('An error occured, please refresh the page to try again.');
    }
  }

  return result;
}

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

export const resign = (gameId) => ({
  type: ACTION_TYPES.RESIGN,
  payload: api.resign(gameId)
})

export const placeBet = (gameId, round, amount) => ({
  type: ACTION_TYPES.PLACE_BET,
  payload: api.placeBet(gameId, round, amount),
  meta: {
    player: auth.getCurrentUser().id,
    amount
  }
});

export const hit = gameId => (dispatch, getState) => {
  const state = getState().game;
  const expectedHandSize = state.cardsInPlayerHand[state.myPlayerIndex + 1].length + 1;
  return dispatch({
    type: ACTION_TYPES.HIT,
    payload: api.hit(gameId),
    meta: {
      expectedHandSize
    }
  });
}

export const stand = gameId => (dispatch, getState) => {
  return dispatch({
    type: ACTION_TYPES.STAND,
    payload: api.stand(gameId),
    meta: {
      expectedPhrase: getState().game.phrase + 1
    }
  });
}


export const readyForNextRound = gameId => ({
  type: ACTION_TYPES.READY_FOR_NEXT_ROUND,
  payload: api.readyForNextRound(gameId)
})

export const reset = () => ({
  type: ACTION_TYPES.RESET
});

export const isPlayer1 = gameInfo => auth.getCurrentUser().id === gameInfo.player_1;
export const isPlayer2 = gameInfo => auth.getCurrentUser().id === gameInfo.player_2;

const performAutomatedResponse = (dispatch, appGameState, gameId, gameState) => {
  if (
    !appGameState.pendingActions[PENDING_TYPES.PASS_SHUFFLED_DECK]
    && !isEmpty(appGameState.cardCodewords)) {
    performAutomatedShufflingPhrase(dispatch, gameId, gameState);
  }

  var self = getSelf();
  if (!isEmpty(self)) {
    for (const playerHand of gameState.cards_in_player_hand) {
      for (const cardInHand of playerHand) {
        if (cardInHand.is_open && !gameState.deck[cardInHand.card_index].reveal_value) {
          api.postCardSecret(gameId, cardInHand.card_index, self.keyPairs[cardInHand.card_index].privateKey);
          if (!isEmpty(gameState.card_decrypts[1 - appGameState.myPlayerIndex][cardInHand.card_index].decrypt_key)) {
            updateOpponentDecrypts(gameState.card_decrypts[1 - appGameState.myPlayerIndex]);
            try {
              const revealValue = decryptCardToName(gameState.deck, cardInHand.card_index);
              api.postCardReveal(gameId, cardInHand.card_index, revealValue);
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    }
  }
}

const performAutomatedShufflingPhrase = async (dispatch, gameId, gameState) => {
  const phrase = gameState.game_state.phrase;
  const receivedDeck = gameState.deck;
  if ((phrase === -4 && isPlayer2(gameState.game))
    || (phrase === -3 && isPlayer1(gameState.game))) {
    try {
      await shuffleAndPassDeck(dispatch, gameId, receivedDeck, phrase === -4);
    } catch (e) {
      console.error(e);
      alert('An error occured, please refresh the page to try again.')
    }
  }

  if ((phrase === -2 && isPlayer2(gameState.game))
    || (phrase === -1 && isPlayer1(gameState.game))) {
    try {
      await encryptAndPassDeck(dispatch, gameId, gameState.deck);
    } catch (e) {
      console.error(e);
      alert('An error occured, please refresh the page to try again.')
    }
  }
}

const shuffleAndPassDeck = async (dispatch, gameId, deck, isNew) => new Promise(async (resolve, reject) => {
  try {
    await dispatch({
      type: ACTION_TYPES.PASS_SHUFFLED_DECK,
      payload: api.passShuffledDeck(gameId, isNew ? initialShuffle() : shuffleDeck(deck.map(card => card.encrypted)))
    });
    resolve();
  } catch (e) {
    console.error(e);
    reject();
  }
});

const encryptAndPassDeck = async (dispatch, gameId, deck) => new Promise(async (resolve, reject) => {
  try {
    await dispatch({
      type: ACTION_TYPES.PASS_SHUFFLED_DECK,
      payload: api.passShuffledDeck(gameId, encryptCards(deck.map(card => card.encrypted)))
    });
    resolve();
  } catch (e) {
    console.error(e);
    reject();
  }
});

const initialState = {
  myPlayerIndex: -1,
  loadingGameStatus: false,
  loadingCardFragments: false,
  messages: [],
  game: {},
  gameState: {},
  cardCodewords: [],
  deck: [],
  cardsInPlayerHand: [[], [], []],
  handsValue: [0, 0, 0],
  playerBets: [],
  playerMonies: [],
  pendingMessages: [],
  fulfilledMessages: [],
  pendingActions: {},
  sending: false,
  resigning: false,
  isReadyForNextRound: false,
  error: null
}


const reducer = (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case PENDING(ACTION_TYPES.FETCH_STATUS):
      return {
        ...state,
        loadingGameStatus: true,
        error: null
      }
    case FULFILLED(ACTION_TYPES.FETCH_STATUS):
      const { game, messages, game_state, deck, player_monies, player_bets, cards_in_player_hand, hands_value } = payload;
      const cardsInPlayerHand = cards_in_player_hand.map(
        playerHand => playerHand.map(cardInHand => ({
          ...cardInHand,
          revealValue: deck[cardInHand.card_index].reveal_value
        }))
      );
      const myPlayerIndex = game.player_1 === auth.getCurrentUser().id ? 0 : 1;
      const isReadyForNextRound = game_state.phrase === 0 ? false : state.isReadyForNextRound;
      return {
        ...state,
        myPlayerIndex,
        loadingGameStatus: false,
        game,
        messages,
        gameState: game_state,
        deck,
        cardsInPlayerHand,
        handsValue: hands_value,
        playerMonies: player_monies,
        playerBets: player_bets,
        fulfilledMessages: [],
        isReadyForNextRound
      }
    case REJECTED(ACTION_TYPES.FETCH_STATUS):
      return {
        ...state,
        loadingGameStatus: false,
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
    case PENDING(ACTION_TYPES.RESIGN):
      return {
        ...state,
        resigning: true,
        error: null
      }
    case ACTION_TYPES.RESET:
      return initialState;
    case REJECTED(ACTION_TYPES.RESIGN):
      return {
        ...state,
        resigning: false,
        error: payload
      }
    case PENDING(ACTION_TYPES.PASS_SHUFFLED_DECK):
      return {
        ...state,
        pendingActions: {
          ...state.pendingActions,
          [PENDING_TYPES.PASS_SHUFFLED_DECK]: true
        }
      }
    case FULFILLED(ACTION_TYPES.PASS_SHUFFLED_DECK):
      return {
        ...state,
        pendingActions: {
          ...state.pendingActions,
          [PENDING_TYPES.PASS_SHUFFLED_DECK]: false
        }
      }
    case PENDING(ACTION_TYPES.PLACE_BET):
      return {
        ...state,
        pendingActions: {
          ...state.pendingActions,
          [PENDING_TYPES.PLACE_BET]: true
        }
      }
    case REJECTED(ACTION_TYPES.PLACE_BET):
      return {
        ...state,
        pendingActions: {
          ...state.pendingActions,
          [PENDING_TYPES.PLACE_BET]: false
        }
      }
    case FULFILLED(ACTION_TYPES.PLACE_BET):
      return {
        ...state,
        playerBets: [
          ...state.playerBets.filter(bet => bet.id !== meta.player),
          {
            id: meta.player,
            amount: meta.amount
          }
        ],
        pendingActions: {
          ...state.pendingActions,
          [PENDING_TYPES.PLACE_BET]: false
        }
      }
    case PENDING(ACTION_TYPES.FETCH_FRAGMENTS):
      return {
        ...state,
        loadingCardFragments: true
      };
    case FULFILLED(ACTION_TYPES.FETCH_FRAGMENTS):
      if (!isEmpty(payload[0]) && !isEmpty(payload[1]) && isEmpty(state.cardCodewords)) {
        return {
          ...state,
          loadingCardFragments: false,
          cardCodewords: createCardCodeWords(payload[1 - state.myPlayerIndex])
        }
      }
      else return {
        ...state,
        loadingCardFragments: false,
      };
    case REJECTED(ACTION_TYPES.FETCH_FRAGMENTS):
      return {
        ...state,
        loadingCardFragments: false
      };
    case PENDING(ACTION_TYPES.HIT):
    case PENDING(ACTION_TYPES.STAND):
      return {
        ...state,
        sending: true
      };
    case FULFILLED(ACTION_TYPES.HIT):
      return {
        ...state,
        sending: false,
        cardsInPlayerHand: state.cardsInPlayerHand.map(
          (playerHand, index) => index !== (state.myPlayerIndex + 1) || playerHand.length === meta.expectedHandSize
            ? playerHand
            : [...playerHand, { card_index: state.gameState.top_card_index, revealValue: "" }]
        )
      };
    case FULFILLED(ACTION_TYPES.STAND):
      return {
        ...state,
        sending: false,
        gameState: {
          ...state.gameState,
          phrase: meta.expectedPhrase
        }
      };
    case REJECTED(ACTION_TYPES.HIT):
    case REJECTED(ACTION_TYPES.STAND):
      return {
        ...state,
        sending: false
      };

    case PENDING(ACTION_TYPES.READY_FOR_NEXT_ROUND):
      return {
        ...state,
        isReadyForNextRound: true
      };
    case REJECTED(ACTION_TYPES.READY_FOR_NEXT_ROUND):
      return {
        ...state,
        isReadyForNextRound: false
      };
    default: return state;
  }
}

export default reducer;