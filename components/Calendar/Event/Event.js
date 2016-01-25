import React, {PropTypes} from 'react';
import classNames from 'classnames';
import './Event.scss';
import { Button, Textfield, Icon } from 'react-mdl';
import { addEvent, modifyEvent, removeEvent} from '../../../core/redux/modules/calendar';
import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import FontIcon from 'material-ui/lib/font-icon';
import Colors from 'material-ui/lib/styles/colors';

@connect()
export default class Event extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onAddEvent: PropTypes.func.isRequired,
    events: PropTypes.object.isRequired,
    dateObject: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.state = {
      addingEvent: false,
    };
  }

  handleAddEvent() {
    if (this.state.addingEvent) {
      this.props.dispatch(addEvent({
        name: findDOMNode(this.refs.nameInput).getElementsByTagName('input')[0].value,
        description: findDOMNode(this.refs.descriptionInput).getElementsByTagName('textarea')[0].value,
        startDate: this.props.dateObject}
      ));
      this.props.onAddEvent();
    }
    this.setState({addingEvent: !this.state.addingEvent});
  }

  render() {
    const mappingKey = new Map();
    const events = Object.keys(this.props.events).sort((_a, _b) => _b.toString().length - _a.toString().length)
      .reduce((prev, cur) => {
        if (this.props.events[cur] && this.props.events[cur].length) {
          mappingKey.set(prev.length + this.props.events[cur].length, cur);
          return prev.concat(this.props.events[cur]);
        }
        return prev;
      }, []);
    return (
      <div className="event-panel">
        <section className="event-list">
          <List>
            { events.map((ev, index) =>
              (<ListItem key={ev.createDate.valueOf()} primaryText={ev.name}
                secondaryText={ev.description}
                secondaryTextLines={2}
                disabled
                leftIcon={
                  <FontIcon
                    className="material-icons"
                    style={{cursor: 'pointer'}}
                    hoverColor={Colors.yellow500}
                    color={ev.stared ? Colors.yellow500 : null}
                    onClick={() => {
                      const mappingKeyIter = mappingKey.entries();
                      let value = mappingKeyIter.next().value;
                      let startDateString;
                      do {
                        startDateString = value[1];
                        value = mappingKeyIter.next().value;
                      } while (value && value[0] <= index);
                      this.props.dispatch(modifyEvent(ev, startDateString, {stared: !ev.stared}));
                    }}
                  >{ev.stared ? 'star' : 'star_border'}</FontIcon>
                }
              />)
            )}
          </List>
        </section>
        <Divider />
        <section className="event-control">
          { this.state.addingEvent &&
            <div style={{textAlign: 'center'}}>
              <Textfield
                onChange={() => {}}
                label="Event name..."
                style={{width: '75%'}}
                ref="nameInput"
                error="This field is required"
                required
              />
              <Textfield
                onChange={() => {}}
                label="Description..."
                rows={2}
                style={{width: '75%'}}
                ref="descriptionInput"
              />
            </div>
          }
          <div style={{textAlign: 'center'}}>
            <Button raised colored primary ripple onClick={::this.handleAddEvent}>{this.state.addingEvent ? 'Add' : <Icon name="add" />}</Button>
            { this.state.addingEvent &&
                <Button onClick={() => this.setState({addingEvent: false})}>Cancel</Button>
            }
          </div>
        </section>
      </div>
    );
  }
}
