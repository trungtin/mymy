import React, {Component, PropTypes} from 'react';
import {Menu, MenuItem, IconButton, Icon, CardTitle, FABButton, Tabs, Tab, Button} from 'react-mdl';
import {connect} from 'react-redux';
import {findDOMNode} from 'react-dom';
import Tooltip from '../Tooltip';
import {removeTab, removeWidget} from './lib/actions';
import './WidgetTitleMenu.scss';

let curId = 1;

@connect()
export default class WidgetTitleMenu extends Component {
  static propTypes = {
    tabs: PropTypes.array,
    onTabChange: PropTypes.func,
    openModal: PropTypes.func,
    deletingTab: PropTypes.bool,
    widgetKey: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      deletingTab: false,
      confirmDeleteTooltipPos: null,
      deleteTab: null,
    };
  }

  calcTooltipPosition(target, pos = 'n') {
    const tabbarRect = findDOMNode(this.refs.titleMenu).getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const vert = pos === 'n' && {top: 0} || (pos === 's' && {top: '100%'} || {});
    return {position: 'absolute', ...vert, left: targetRect.left - tabbarRect.left - 100 + targetRect.width / 2, width: 200, padding: 10,
      transition: 'all 0.3s ease-in-out'};
  }

  render() {
    return (
      <div>
        <CardTitle style={{justifyContent: 'space-between', padding: '0px 16px', position: 'relative'}} ref="titleMenu">
          <Tabs ripple activeTab={0} onChange={this.props.onTabChange}>
            { this.props.tabs && this.props.tabs.map((tab, index) =>
              <Tab key={`tab-${index}`} ref={`tab-${index}`}>
                { this.state.deletingTab &&
                  <Icon name="highlight_off" ripple className= "delete-tab__mark" onClick={() => {
                    this.setState({confirmDeleteTooltipPos: this.calcTooltipPosition(findDOMNode(this.refs[`tab-${index}`])), deleteTab: tab});
                  }}/>
                }
                {tab}
              </Tab>)}
          </Tabs>
          {
            this.state.confirmDeleteTooltipPos &&
            <Tooltip content={<div>
                <h6 style={{margin: '0 0 10px 0'}}>Do you want to delete {this.state.deleteTab && `__${this.state.deleteTab}__ tab` || `this widget`}?</h6>
                <Button raised accent onClick={() => {
                  this.state.deleteTab && removeTab(this.props.dispatch, this.props.widgetKey, this.state.deleteTab);
                  !this.state.deleteTab && removeWidget(this.props.dispatch, this.props.widgetKey);
                  this.setState({confirmDeleteTooltipPos: null, deleteTab: null});
                }}><h6 style={{margin: 0}}>Yeah</h6></Button>
                <Button style={{color: 'white'}} onClick={() => this.setState({confirmDeleteTooltipPos: null, deleteTab: null})}><h6 style={{margin: 0}}>Cancel</h6></Button>
              </div>} noTriangle={!this.state.deleteTab} style={this.state.confirmDeleteTooltipPos} tooltipStyle={{width: 280}} position={this.state.deleteTab && 'n' || 's'}/>
          }
          <div>
            <IconButton id={'widget-title-menu-' + curId} name="more_vert" ripple/>
            <Menu target={'widget-title-menu-' + curId++} ripple align="right" valign="bottom">
              <li className="mdl-menu__special-item">
                <FABButton mini colored raised ripple onClick={(event) => this.props.openModal(event, {element: 1})}>
                  <Icon name="add_to_photos" ripple/>
                </FABButton>
                <FABButton mini primary raised ripple onClick={() => this.setState({deletingTab: !this.state.deletingTab})}>
                  <Icon name={this.state.deletingTab ? 'done' : 'delete'} ripple/>
                </FABButton>
              </li>
              <MenuItem onClick={() => this.setState({confirmDeleteTooltipPos: this.calcTooltipPosition(findDOMNode(this.refs.titleMenu), 's'), deleteTab: null})}>Delete widget !!!</MenuItem>
              <MenuItem>Ipsum</MenuItem>
            </Menu>
          </div>
        </CardTitle>
        { this.state.confirmDeleteTooltipPos && !this.state.deleteTab &&
          <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, backgroundColor: '#4F5A65', opacity: 0.3}} onClick={() => this.setState({confirmDeleteTooltipPos: null, deleteTab: null})}></div>
        }
      </div>
    );
  }
}
