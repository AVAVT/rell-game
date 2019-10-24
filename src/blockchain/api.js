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