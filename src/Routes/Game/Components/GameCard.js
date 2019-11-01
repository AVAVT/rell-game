import React from 'react';

export default class GameCard extends React.Component {
  state = {
    top: this.props.orinTop,
    left: this.props.orinLeft
  }

  componentDidMount() {
    setTimeout(() => this.setState({
      top: this.props.top,
      left: 0
    }), 0)
  }

  render() {
    const { top, left } = this.state;
    const { cardName, style } = this.props;
    return (
      <div
        className="game-card"
        style={{
          ...style,
          top,
          left,
          width: 100
        }}
      >
        <div
          className="game-card-inner"
          style={{
            transform: cardName !== 'back' ? 'none' : 'rotateY(180deg)'
          }}>
          <img
            className="game-card-face"
            width="100"
            alt={cardName} src={`${process.env.PUBLIC_URL}/images/cards/${cardName}.svg`}
          />
          <img
            className="game-card-back"
            width="100"
            alt="card-back" src={`${process.env.PUBLIC_URL}/images/cards/back.svg`}
          />
        </div>
      </div>

    )
  }
}