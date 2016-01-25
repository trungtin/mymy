import React, {PropTypes} from 'react';
import {Icon} from 'react-mdl';

export default class NumberSelectable extends React.Component {

  static propTypes = {
    range: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
    initial: PropTypes.number,
    step: PropTypes.number,
    raised: PropTypes.bool,
  }

  static defaultProps = {
    initial: 0,
    step: 1,
  }

  constructor(props) {
    super(props);
    this.state = {
      count: props.initial,
    };
  }

  getValue() {
    return this.state.count;
  }

  render() {
    const defaultStyle = {
      boxShadow: this.props.raised && '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
      borderRadius: 4,
      padding: '0.5rem',
      background: 'white',
      color: 'darkblue',
      fontSize: 18,
      lineHeight: 1,
    };
    const disabledIncrement = this.props.range && (this.state.count >= this.props.range[1] || this.state.count >= this.props.range);
    const disabledDecrement = this.props.range && this.state.count <= this.props.range[0];
    return (
      <div style={{display: 'inline-block', margin: '0 0.5rem'}}>
        <Icon name="expand_less" style={{cursor: 'pointer', msUserSelect: 'none', MozUserSelect: 'none', WebkitUserSelect: 'none'}} onClick={() => !disabledIncrement && this.setState({count: this.state.count + this.props.step})} />
        <div style={defaultStyle}>{this.state.count}</div>
        <Icon name="expand_more" style={{cursor: 'pointer', msUserSelect: 'none', MozUserSelect: 'none', WebkitUserSelect: 'none'}} onClick={() => !disabledDecrement && this.setState({count: this.state.count - this.props.step})} />
      </div>
      );
  }
}
