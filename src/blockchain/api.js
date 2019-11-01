import blockchain from './blockchain';
import crypto from 'crypto';
import auth from './auth';

export const lookForGame = () => {
  if (!auth.isLoggedIn()) return false;
  const { id, privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("look_for_game", id, crypto.randomBytes(32));
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const stopLookingForGame = () => {
  if (!auth.isLoggedIn()) return false;
  const { id, privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("stop_looking_for_game", id, crypto.randomBytes(32));
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const joinGame = (userId) => {
  if (!auth.isLoggedIn()) return false;
  const { id, privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("join_game", id, userId, crypto.randomBytes(32));
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const postMessage = (gameId, message) => {
  const { id, privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("post_message", gameId, id, message, crypto.randomBytes(32));
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const resign = (gameId) => {
  const { id, privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("resign", gameId, id, crypto.randomBytes(32));
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const getLobbyStatus = () => blockchain.getGtx().query("get_lobby_status", {});

export const getGameStatus = (gameId) => {
  return blockchain.getGtx().query("get_game_status", { game: gameId });
}

export const passShuffledDeck = (gameId, deck) => {
  const { id, privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("pass_shuffled_deck", gameId, id, deck);
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const placeBet = (gameId, round, amount) => {
  const { id, privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("place_bet", gameId, id, round, amount);
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const hit = (gameId) => {
  const { id, privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("player_hit", gameId, id, crypto.randomBytes(32));
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const stand = (gameId) => {
  const { id, privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("player_stand", gameId, id, crypto.randomBytes(32));
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const getCardFragments = (gameId) => {
  return blockchain.getGtx().query("get_card_fragments", { game: gameId });
}

export const postCardFragments = (gameId, fragments) => {
  const { id, privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("post_card_fragments", gameId, id, fragments);
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const postCardSecret = (gameId, cardIndex, decrypt) => {
  const { id, privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("post_card_secret", gameId, id, cardIndex, decrypt);
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const postCardReveal = (gameId, cardIndex, cardReveal) => {
  console.log(`Posting cardReveal: ${cardReveal}`)
  const { id, privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("post_card_reveal", gameId, id, cardIndex, cardReveal);
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const readyForNextRound = (gameId) => {
  const { id, privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("ready_for_next_round", gameId, id, crypto.randomBytes(32));
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}