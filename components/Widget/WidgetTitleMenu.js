import React, {Component, PropTypes} from 'react';
import {Menu, MenuItem, IconButton, Icon, CardTitle, FABButton, Tabs, Tab, Button } from 'react-mdl';
import {connect} from 'react-redux';
import {findDOMNode} from 'react-dom';
import Tooltip from '../Tooltip';
import {removeTab, removeWidget, editWidgetSize, toggleTabbar} from './lib/actions';
import './WidgetTitleMenu.scss';
import NumberSelectable from '../NumberSelectable';

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
    size: PropTypes.array.isRequired,
    hideTabbar: PropTypes.bool,
  }

  constructor() {
    super();
    this.initialState = {
      deletingTab: false,
      confirmDeleteTooltipPos: null,
      editWidgetSizeTooltipPos: null,
      deleteTab: null,
    };
    this.state = this.initialState;
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
          { !this.props.hideTabbar &&
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
          }
          {
            this.state.confirmDeleteTooltipPos &&
            <Tooltip content={<div>
                <h6 style={{margin: '0 0 10px 0'}}>Do you want to delete {this.state.deleteTab && `__${this.state.deleteTab}__ tab` || `this widget`}?</h6>
                <Button raised accent onClick={() => {
                  if (this.state.deleteTab) {
                    const newTab = this.props.tabs.indexOf(this.state.deleteTab) - 1;
                    this.props.onTabChange(newTab > -1 ? newTab : 1);
                    removeTab(this.props.dispatch, this.props.widgetKey, this.state.deleteTab);
                  } else {
                    removeWidget(this.props.dispatch, this.props.widgetKey);
                  }
                  this.setState({confirmDeleteTooltipPos: null, deleteTab: null});
                }}><h6 style={{margin: 0}}>Yeah</h6></Button>
                <Button style={{color: 'white'}} onClick={() => this.setState({confirmDeleteTooltipPos: null, deleteTab: null})}><h6 style={{margin: 0}}>Cancel</h6></Button>
              </div>} noTriangle={!this.state.deleteTab} style={this.state.confirmDeleteTooltipPos} tooltipStyle={{width: 280}} position={this.state.deleteTab && 'n' || 's'}/>
          }
          {
            this.state.editWidgetSizeTooltipPos &&
            <Tooltip content={
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <span>New widget size: </span>
                  <NumberSelectable initial={this.props.size[0]} range={[1, 4]} style={{display: 'inline'}} ref="newWidgetSizeCol" />
                  <span> columns, </span>
                  <NumberSelectable initial={this.props.size[1]} range={[1, 3]} style={{display: 'inline'}} ref="newWidgetSizeRow"/>
                  <span> rows.</span>
                </div>
                <div>
                  <Button raised accent ripple
                    onClick={() => {
                      editWidgetSize(this.props.dispatch, this.props.widgetKey, `${this.refs.newWidgetSizeRow.getValue()}${this.refs.newWidgetSizeCol.getValue()}`);
                      this.setState(this.initialState);
                    }}>Save</Button>
                  <Button onClick={() => this.setState(this.initialState)} style={{color: 'white'}}>Cancel</Button>
                </div>
              </div>
            } noTriangle style={this.state.editWidgetSizeTooltipPos} tooltipStyle={{width: 350}} position="s" />
          }
          <div style={this.props.hideTabbar ? {position: 'absolute', right: -16, zIndex: 5} : {}}>
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
              <MenuItem onClick={() => this.setState({...this.initialState, editWidgetSizeTooltipPos: this.calcTooltipPosition(findDOMNode(this.refs.titleMenu), 's')})}>Edit widget size</MenuItem>
              <MenuItem onClick={() => toggleTabbar(this.props.dispatch, this.props.widgetKey)}>{this.props.hideTabbar ? 'Show' : 'Hide'} Tabbar</MenuItem>
              <MenuItem onClick={() => this.setState({...this.initialState, confirmDeleteTooltipPos: this.calcTooltipPosition(findDOMNode(this.refs.titleMenu), 's')})}><h6 style={{margin: 0, lineHeight: '48px', color: 'red'}}>Delete widget !!!</h6></MenuItem>
            </Menu>
          </div>
        </CardTitle>
        { (this.state.confirmDeleteTooltipPos && !this.state.deleteTab || this.state.editWidgetSizeTooltipPos) &&
          <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, backgroundColor: '#4F5A65', opacity: 0.3}} onClick={() => this.setState(this.initialState)}></div>
        }
      </div>
    );
  }
}
