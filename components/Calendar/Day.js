import React, {PropTypes} from 'react';
import classNames from 'classnames';
import './Day.scss';

export default class Day extends React.Component {
  static propTypes = {
    day: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    blur: PropTypes.bool,
  }

  render() {
    const className = classNames('calendar-day', {'calendar-day--selected': this.props.selected, 'calendar-day--blur': this.props.blur});
    return (
      <div className={className}>
        <span onClick={this.props.onSelect}>{this.props.day}</span>
      </div>
    );
  }
}
