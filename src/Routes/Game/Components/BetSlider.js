import React from 'react';
import Slider from 'react-input-slider';
import { Button } from 'reactstrap';

export default class BetSlider extends React.PureComponent {
  state = {
    value: Math.min(this.props.maxValue, 10)
  }

  render() {
    return (
      <div className="d-flex align-items-center">
        <span style={{ minWidth: '3em' }} className="mr-3 text-right">${this.state.value}</span>
        <Slider
          axis="x"
          x={this.state.value}
          onChange={({ x }) => this.setState({ value: x })}
          xmax={this.props.maxValue}
          xmin={1}
          styles={{
            active: {
              backgroundColor: '#007bff'
            }
          }}
        />
        <Button color="primary" disabled={this.props.disabled} className="ml-3" onClick={() => this.props.onSubmit(this.state.value)}>OK</Button>
      </div>
    )
  }
}