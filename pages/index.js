import React, { Component } from 'react';
import {Textfield, Content, Grid} from 'react-mdl';
import {WidgetContainer} from '../components';
import './styles/index.scss';
import {connect} from 'react-redux';
import * as widgetActions from '../core/redux/modules/widget';

const allowedWidth = typeof window !== 'undefined' && window.innerWidth > 1600 ? [null, '80%', '100%'] : [null, '100%'] || [];

@connect(state => ({
  meta: state.widget.meta,
  bg: state.configuration.background,
}))
export default class extends Component {
  static propTypes = {
    meta: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    bg: React.PropTypes.string,
  }
  static defaultProps = {
    meta: {},
  }
  constructor(props) {
    super();
    this.state = {
      extendedWidth: allowedWidth[props.meta.size || 0],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.meta) {
      this.setState({extendedWidth: allowedWidth[nextProps.meta.size || 0]});
    }
  }

  render() {
    return (
      <Content style={{
        position: 'relative',
        background: this.props.bg ? `url("${this.props.bg}") top left / cover` : ``,
      }}>
        <section className="main-content" style={{width: this.state.extendedWidth}}>
          <Grid className="control-block">
            <Textfield floatingLabel label="Search..." />
          </Grid>
          <WidgetContainer/>
        </section>
        { typeof window !== 'undefined' && window.innerWidth > 1200 &&
          <i className="material-icons zoom-out-icons" onClick={() => {
            const newSize = !this.props.meta.size ? 1 : this.props.meta.size === 1 ? 2 : 0;
            const db = new window.PouchDB('mymy-db');
            db && db.get('widget').then(doc => {
              if (!doc.meta) doc.meta = {};
              doc.meta.size = newSize;
              return db.put(doc);
            }).then(response => {
              if (response.ok !== true) {
                throw Error('Error while put new link to widget');
              }
            }).then(() => {
              this.props.dispatch(widgetActions.extendLayout(newSize));
            }).catch(err => this.props.dispatch(widgetActions.databaseError(err)));
          }}>settings_ethernet</i>
        }
      </Content>
    );
  }

}
