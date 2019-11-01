import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

const RuleModal = props => (
  <Modal isOpen={props.isOpen} toggle={props.onClose}>
    <ModalHeader toggle={props.onClose}>
      Rules
    </ModalHeader>
    <ModalBody>
      This game is basically Blackjack (21) with some small changes:
      <ul>
        <li>Use only a single 52 deck. No reshuffle.</li>
        <li>The goal is to have more money than your opponent at the end of the game.</li>
        <li>
          Game ends when the deck has run out of card:
          <ul>
            <li>At start of each round, if the deck has less than 6 cards, the game ends immediately.</li>
            <li>Otherwise, when the deck runs out of card, the current round is scored immediately, no one (not even dealer) can receive any more card.</li>
          </ul>
        </li>
        <li>Blackjack pays out 2:1, normal wins pay out 1:1.</li>
        <li>Currently you can only hit or stand, no double up or split yet (sorry!)</li>
      </ul>
    </ModalBody>
  </Modal>
);

export default RuleModal;