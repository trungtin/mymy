import React, {PropTypes} from 'react';
import Day from './Day';
import * as DateUtils from './utils';
import * as Utils from '../utils';
import './Month.scss';

export default class Month extends React.Component {
  static propTypes = {
    month: PropTypes.number.isRequired,
    year: PropTypes.number,
    dayOfThisMonthSelected: PropTypes.number,
    onDaySelect: PropTypes.func.isRequired,
    className: PropTypes.string,
  }

  render() {
    const firstWeekday = DateUtils.getFirstWeekdayOfMonth(this.props.month, this.props.year);
    const lastMonthDaysLeft = [];
    if (firstWeekday > 0) {
      let lastMonthTotalDays = this.props.month === 0 ? DateUtils.getNumOfDay(11, this.props.year - 1) : DateUtils.getNumOfDay(this.props.month - 1, this.props.year);
      while (lastMonthDaysLeft.length < firstWeekday) {
        lastMonthDaysLeft.unshift(lastMonthTotalDays--);
      }
    }
    const thisMonthDays = Utils.range( 1, DateUtils.getNumOfDay(this.props.month, this.props.year) + 1 );
    return (
      <div className={this.props.className}>
        <section className="calendar-month-name">{DateUtils.getMonthFullName(this.props.month) + ' ' + this.props.year}</section>
        <section className="calendar-weekday-panel">{DateUtils.getWeekDayShortNameList().map(wd =>
          <span className="calendar-weekday">{wd}</span>
        )}</section>
        <section className="calendar-day-panel">{
          lastMonthDaysLeft.map(day => <Day day={day} blur onSelect={() =>
            this.props.month === 0 ?
              this.props.onDaySelect(day, 11, this.props.year - 1) :
              this.props.onDaySelect(day, this.props.month - 1, this.props.year)
            }/>)
        }{
          thisMonthDays.map(day => <Day day={day} selected={day === this.props.dayOfThisMonthSelected}
            onSelect={() => this.props.onDaySelect(day, this.props.month, this.props.year)}/>)
        }</section>
      </div>
    );
  }
}
