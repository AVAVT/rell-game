import { combineReducers } from "redux";
import config from "./config/config";
import lobby from './lobby/lobby';
import game from './game/game';

export default combineReducers({
  config,
  lobby,
  game
});
