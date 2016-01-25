import React, {PropTypes} from 'react';
import {Icon} from 'react-mdl';
import Month from './Month';
import Event from './Event';
import * as DateUtils from './utils';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Calendar.scss';
import {connect} from 'react-redux';

@connect(
  state => ({calendarEvent: state.calendar})
)
export default class Calendar extends React.Component {
  static propTypes = {
    onDateChange: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    calendarEvent: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    const today = new Date();
    this.state = {
      dateObject: today,
      month: today.getMonth(),
      year: today.getFullYear(),
      transitionGoLeft: false,
      events: {},
      showEventPanel: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.calendarEvent !== this.props.calendarEvent) {
      this.getEvents(undefined, undefined, undefined, nextProps);
    }
  }

  getEvents(date, month = this.state.dateObject.getMonth(), year = this.state.dateObject.getFullYear(), nextProps) {
    const dateObject = (date && typeof date === 'number') ? new Date(year, month, date) : this.state.dateObject;
    const _calendar = (nextProps || this.props).calendarEvent;
    const repititiveDateList = [];
    repititiveDateList.push('d');
    repititiveDateList.push(`${dateObject.getDay()}`);
    repititiveDateList.push(`${date > 9 ? `${date}` : `0${date}`}`);
    repititiveDateList.push(`${date > 9 ? `${date}` : `0${date}`}${month > 9 ? `${month}` : `0${month}`}`);
    const events = {};
    events[dateObject.toDateString()] = _calendar.nonRepeat[dateObject.toDateString()] && _calendar.nonRepeat[dateObject.toDateString()].events;
    repititiveDateList.forEach(dateKey => {
      // filter repetitive events with startDate later than selected date.
      events[dateKey] = _calendar.repeat[dateKey] && _calendar.repeat[dateKey].events.filter(eventData => dateObject > eventData.startDate);
    });
    this.setState({dateObject, month, year, events, transitionGoLeft: year < this.state.year || (year === this.state.year && month < this.state.month)});
  }

  selectNextMonth() {
    if (this.state.month === 11) {
      return this.setState({month: 0, year: this.state.year + 1, transitionGoLeft: false});
    }
    this.setState({month: this.state.month + 1, transitionGoLeft: false});
  }

  selectPreviousMonth() {
    if (this.state.month === 0) {
      return this.setState({month: 11, year: this.state.year - 1, transitionGoLeft: true});
    }
    this.setState({month: this.state.month - 1, transitionGoLeft: true});
  }

  render() {
    const selectedDateInThisMonth = this.state.dateObject.getMonth() === this.state.month && this.state.dateObject.getFullYear() === this.state.year;
    return (<section>
      <header className="calendar-header">
        <p className="calendar-header--year">{this.state.dateObject.getFullYear()}</p>
        <p className="calendar-header--date">{DateUtils.getWeekDayFullName(this.state.dateObject.getDay()) + ', ' +
          DateUtils.getMonthFullName(this.state.dateObject.getMonth()) + ' ' +
          this.state.dateObject.getDate()
        }<sup className="calendar-event-count-badge" onClick={() => this.setState({showEventPanel: !this.state.showEventPanel})}>{this.state.events && Object.keys(this.state.events).reduce((prev, cur) =>
            prev + (this.state.events[cur] ? this.state.events[cur].length : 0), 0
          )}</sup></p>
      </header>
      <section className="calendar-body">
        <div className="calendar-selector">
          <Icon name="chevron_left" onClick={::this.selectPreviousMonth}/>
          <Icon name="chevron_right" onClick={::this.selectNextMonth}/>
        </div>
        <ReactCSSTransitionGroup
          transitionName={`calendar-month${this.state.transitionGoLeft ? '--left' : ''}`}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          <Month key={this.state.month} month={this.state.month} year={this.state.year} dayOfThisMonthSelected={selectedDateInThisMonth ? this.state.dateObject.getDate() : null}
            onDaySelect={::this.getEvents} className="calendar-month"
          />
        </ReactCSSTransitionGroup>
        <ReactCSSTransitionGroup
          transitionName={`calendar-event`}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {
          this.state.showEventPanel &&
            <div className="calendar-event" onClick={event => event.target === event.currentTarget && this.setState({showEventPanel: false})}>
              <Event events={this.state.events} dateObject={this.state.dateObject} onAddEvent={() => ({})}/>
            </div>
          }
        </ReactCSSTransitionGroup>
      </section>
    </section>);
  }
}
