import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {Grid, Cell, Icon, Button} from 'react-mdl';
import structureWidget from './lib/structureWidget';
import Modal from './Modal';
import './WidgetContainer.scss';
import {addLinkToWidget as _addLinkToWidget, addTabToWidget as _addTabToWidget, addWidget as _addWidget} from './lib/actions';
import {AddLinkModalContent, AddTabModalContent} from './ModalContent';
import Tooltip from '../Tooltip';
import NumberSelectable from '../NumberSelectable';

@connect(
  state => ({data: state.widget.data})
  )
export default class WidgetContainer extends Component {

  static propTypes = {
    data: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      modalOpen: false,
      modalTarget: false,
      modalContent: {},
      data: undefined,
      linkList: [],
      feedList: [],
      toBeAddedLinkList: [],
      stashedModal: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({data: nextProps.data, toBeAddedLinkList: []});
    }
  }

  async fetchData() {
    let linkList;
    let feedList;
    const db = new window.PouchDB('mymy-db');
    if (!this.state.linkList || !this.state.linkList.length) {
      linkList = await db.get('link');
    } else {
      linkList = this.state.linkList;
    }
    if (!this.state.feedList || !this.state.feedList.length) {
      feedList = await db.get('feed');
    } else {
      feedList = this.state.feedList;
    }
    const containerData = this.props.data;
    for (const key in containerData) {
      if (containerData.hasOwnProperty(key)) {
        const widgetData = containerData[key];
        for (const tabKey in widgetData.data) {
          if (widgetData.data.hasOwnProperty(tabKey)) {
            if (widgetData.data[tabKey].type === 'link') {
              widgetData.data[tabKey] = {...widgetData.data[tabKey], data: widgetData.data[tabKey].data.map(link => linkList[link])};
            } else if (widgetData.data[tabKey].type === 'feed') {
              const feedData = widgetData.data[tabKey].data;
              const feedLocation = feedData.location.split('#');
              const userData = feedData.supplyData;
              const extractedData = Object.assign({}, feedLocation.reduce((prev, cur) => prev[cur], feedList));
              if (Array.isArray(extractedData.require)) {
                if (Array.isArray(userData) && userData.length === extractedData.require.length) {
                  Object.keys(extractedData).filter(_key => _key !== 'require').forEach(_key => {
                    extractedData.require.forEach((required, index) => {
                      extractedData[_key] = typeof extractedData[_key] === 'string' && extractedData[_key].replace(new RegExp('\\$\\{' + index + '\\}', 'g'), userData[index]) || extractedData[_key];
                    });
                  });
                }
              }
              widgetData.data[tabKey] = {...widgetData.data[tabKey], data: extractedData, ...linkList[feedLocation[0]]};
            }
          }
        }
      }
    }
    this.setState({data: containerData, linkList, feedList});
  }

  openModal(event, modalContent, widgetKey, tabKey, stashLastModal) {
    if (stashLastModal) {
      this.setState({stashedModal: [...this.state.stashedModal, {
        modalTarget: this.state.modalTarget,
        modalTargetTab: this.state.modalTargetTab,
        modalContent: this.state.modalContent,
        toBeAddedLinkList: this.state.toBeAddedLinkList,
      }]});
    }
    if (widgetKey !== this.state.modalTarget) {
      // reset toBeAddedLinkList
      return this.setState({modalOpen: true, modalTarget: widgetKey, modalTargetTab: tabKey, modalContent, toBeAddedLinkList: []});
    }
    return this.setState({modalOpen: true, modalTarget: widgetKey, modalTargetTab: tabKey, modalContent});
  }
  closeModal() {
    if (this.state.stashedModal.length) {
      return this.setState(this.state.stashedModal.pop());
    }
    this.setState({modalOpen: false});
  }

  selectLinkToAdd(event, link) {
    const index = this.state.toBeAddedLinkList.indexOf(link);
    const arr = this.state.toBeAddedLinkList;
    if (~index) {
      arr.splice(index, 1);
    } else {
      arr.push(link);
    }
    return this.setState({toBeAddedLinkList: arr});
  }

  mapLink(array) {
    return array.map(link => this.state.linkList[link]);
  }

  addLinkToWidget(event, forcedTarget, forcedTargetTab) {
    const mappedToBeAddedLinkList = this.mapLink(this.state.toBeAddedLinkList);
    _addLinkToWidget(this.props.dispatch, forcedTarget || this.state.modalTarget, forcedTargetTab || this.state.modalTargetTab, this.state.toBeAddedLinkList, mappedToBeAddedLinkList);
    this.closeModal();
  }

  addLinkTabToWidget(event, targetTab) {
    const mappedToBeAddedLinkList = this.mapLink(this.state.toBeAddedLinkList);
    _addTabToWidget(this.props.dispatch, this.state.modalTarget, targetTab, {type: 'link', data: this.state.toBeAddedLinkList}, {type: 'link', data: mappedToBeAddedLinkList});
    this.closeModal();
  }

  addFeedTabToWidget(event, targetTab, data) {
    const {location, supplyData, __html} = data;
    _addTabToWidget(this.props.dispatch, this.state.modalTarget, targetTab, {type: 'feed', data: {location, supplyData}}, {type: 'feed', data: {__html}});
    this.closeModal();
  }

  createNewWidget(event, size) {
    _addWidget(this.props.dispatch, {size: size.join(''), data: {}});
  }

  render() {
    let gridContent = undefined;
    if (this.state.data && Object.keys(this.state.data).length) {
      gridContent = structureWidget(this.state.data, this);
    }

    let modalContentEl;
    if (this.state.modalContent.element === 0) {
      modalContentEl = (<AddLinkModalContent linkList={this.state.linkList} toBeAddedLinkList={this.state.toBeAddedLinkList}
        selectLinkToAdd={::this.selectLinkToAdd} addLinkToWidget={::this.addLinkToWidget} closeModal={::this.closeModal}
      />);
    } else if (this.state.modalContent.element === 1) {
      modalContentEl = (<AddTabModalContent link_linkList={this.state.linkList} link_toBeAddedLinkList={this.state.toBeAddedLinkList}
        link_selectLinkToAdd={::this.selectLinkToAdd} link_addLinkTabToWidget={::this.addLinkTabToWidget} closeModal={::this.closeModal}
        feed_feedList={this.state.feedList} feed_addFeedTabToWidget={::this.addFeedTabToWidget} openModal={::this.openModal}
        tabList={Object.keys(this.props.data[this.state.modalTarget].data)}
      />);
    } else {
      modalContentEl = this.state.modalContent.element;
    }
    return (
      <div id="modal__docker">
        <Grid>
          { gridContent !== undefined && gridContent }
          <Tooltip toggleOnClick content={
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <span>New widget size: </span>
                <NumberSelectable initial={3} range={[1, 3]} style={{display: 'inline'}} ref="newWidgetRow"/>
                <span> rows, </span>
                <NumberSelectable initial={2} range={[1, 4]} style={{display: 'inline'}} ref="newWidgetCol" />
                <span> columns.</span>
              </div>
              <div>
                <Button raised accent ripple
                  onClick={(event) => {
                    this.createNewWidget(event, [this.refs.newWidgetRow.getValue(), this.refs.newWidgetCol.getValue()]);
                    return this.refs.newWidgetConfirmTooltip.toggleShowing();
                  }}>Create</Button>
                <Button onClick={() => this.refs.newWidgetConfirmTooltip.toggleShowing()} style={{color: 'white'}}>Cancel</Button>
              </div>
            </div>
          } noTriangle style={{width: '100%'}} tooltipStyle={{width: 350}} position="n" ref="newWidgetConfirmTooltip">
            <Cell col={12} className="add-widget__cell">
              <Icon name="add_circle"/>
            </Cell>
          </Tooltip>
        </Grid>
        <Modal modalOpen={this.state.modalOpen} closeModal={::this.closeModal} modalContent={modalContentEl}/>
      </div>
    );
  }
}

export default WidgetContainer;

/**
 *
 *
        <Cell col={12} tablet={8}>
          <Grid className="grid__3x">
            <Cell col={6} tablet={4}>
              <Widget title="Hello" />
            </Cell>
            <Cell col={6} tablet={4}>
              <Grid className="grid__2x">
                <Cell col={12} tablet={8}>
                  <Widget title="Hello" />
                </Cell>
              </Grid>
              <Grid className="grid__1x">
                <Cell col={12} tablet={8}>
                  <Widget title="Hello" />
                </Cell>
              </Grid>
            </Cell>
          </Grid>
        </Cell>
 *
 */
