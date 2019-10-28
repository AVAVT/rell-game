import { knuthShuffle as shuffle } from 'knuth-shuffle';
import { isEmpty } from 'lodash';
import { createConfig, createPlayer, createDeck, encryptDeck, decryptDeck, decryptCard } from 'mental-poker';

export const cardNames = [
  "1D", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD",
  "1H", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH",
  "1S", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS",
  "1C", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC"
];

let config;
let self;
let opponent;
let cardCodewords;

export const getSelf = () => self;

export const newGame = () => {
  config = createConfig(cardNames.length);
  const selfAsBuffer = createPlayer(config);
  self = {
    cardCodewordFragments: selfAsBuffer.cardCodewordFragments.map(buffer => buffer.toString('hex')),
    keyPairs: selfAsBuffer.keyPairs.map(keyPair => ({
      privateKey: keyPair.privateKey.toString('hex')
    }))
  }
  opponent = null;
  cardCodewords = [];

  return {
    config,
    self
  }
}

export const loadGame = (cachedSelf, cachedConfig) => {
  self = cachedSelf;
  config = cachedConfig;
  opponent = null;
  cardCodewords = [];

  return {
    config,
    self
  }
}

export const createCardCodeWords = opponentFragments => {
  if (isEmpty(self)) return [];

  opponent = {
    cardCodewordFragments: opponentFragments,
    keyPairs: Array.from({ length: 53 }).map(() => ({}))
  };

  cardCodewords = createDeck(
    [self, opponent].map(player => player.cardCodewordFragments.map(fragment => Buffer.from(fragment, 'hex'))),
  );

  return cardCodewords;
}

export const initialShuffle = () => shuffleDeck(cardCodewords.map(card => card.toString('hex')))

export const shuffleDeck = deck => {
  console.log(deck);
  return encryptDeck(
    shuffle(deck.map(card => Buffer.from(card, 'hex'))),
    Buffer.from(self.keyPairs[config.cardCount].privateKey, 'hex')
  ).map(card => card.toString('hex'));
}

export const encryptCards = deck => encryptDeck(
  decryptDeck(deck.map(card => Buffer.from(card, 'hex')), Buffer.from(self.keyPairs[config.cardCount].privateKey, 'hex')),
  self.keyPairs.map(keyPair => Buffer.from(keyPair.privateKey, 'hex')),
).map(card => card.toString('hex'));

export const decryptCardToName = (deck, cardIndex, opponentKeyHex) => {
  opponent.keyPairs[cardIndex].privateKey = opponentKeyHex;
  const cardEncrypted = deck[cardIndex];
  const cardDecrypted = decryptCard(
    cardEncrypted,
    [self, opponent].map(player => Buffer.from(player.keyPairs[cardIndex].privateKey, 'hex')),
  );

  return cardNames[cardCodewords.findIndex(cardCodeword => cardCodeword.equals(cardDecrypted))];
}