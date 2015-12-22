import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {Grid, Cell} from 'react-mdl';
import structureWidget from './lib/structureWidget';
import Modal from 'react-modal';
import './WidgetContainer.scss';
import './Modal.scss';
import LinkList from '../LinkList';
import {addLinkToWidget as _addLinkToWidget} from './lib/actions';
import {AddLinkModalContent, AddTabModalContent} from './ModalContent';

@connect(
  state => ({data: state.widget.data})
  )
export default class WidgetContainer extends Component {

  static propTypes = {
    data: PropTypes.object,
    dispatch: PropTypes.func,
    editLayout: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      modalOpen: false,
      modalTarget: false,
      data: undefined,
      linkList: [],
      feedList: [],
      toBeAddedLinkList: [],
    };
  }

  componentDidMount() {
    this.getLink();
  }

  componentWillReceiveProps(nextProps) {
    console.log('is same: ', nextProps.data === this.props.data)
    if (nextProps.data !== this.props.data) {
      this.setState({data: nextProps.data, toBeAddedLinkList: []});
    }
  }

  async getLink() {
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
              const feedLocation = widgetData.data[tabKey].data.split('#');
              const data = feedLocation.reduce((prev, cur) => prev[cur], feedList);
              widgetData.data[tabKey] = {...widgetData.data[tabKey], data};
            }
          }
        }
      }
    }
    this.setState({data: containerData, linkList, feedList});
  }

  openModal(event, modalContent, widgetKey, tabKey) {
    if (widgetKey !== this.state.modalTarget) {
      // reset toBeAddedLinkList
      return this.setState({modalOpen: true, modalTarget: widgetKey, modalTargetTab: tabKey, modalContent, toBeAddedLinkList: []});
    }
    return this.setState({modalOpen: true, modalTarget: widgetKey, modalTargetTab: tabKey, modalContent});
  }
  closeModal() {
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

  async mapLink(array) {
    return array.map(link => this.state.linkList[link]);
  }

  async addLinkToWidget(event, forcedTarget, forcedTargetTab) {
    const mappedToBeAddedLinkList = await this.mapLink(this.state.toBeAddedLinkList);
    _addLinkToWidget(this.props.dispatch, forcedTarget || this.state.modalTarget, forcedTargetTab || this.state.modalTargetTab, this.state.toBeAddedLinkList, mappedToBeAddedLinkList);
    this.closeModal();
  }

  render() {
    console.log('widget container render')
    let gridContent = undefined;
    if (this.state.data && Object.keys(this.state.data).length) {
      gridContent = structureWidget(this.state.data, this);
    }
    console.log(this.state.modalContent);
    return (
      <div id="modal__docker">
        <Grid>
          { gridContent !== undefined && gridContent }
        </Grid>

        <Modal isOpen={this.state.modalOpen} onRequestClose={::this.closeModal}
          style={{
            overlay: {
              position: 'fixed',
              top: 64,
              zIndex: 100,
            },
            content: {
            },
          }}
        >
          { this.state.modalContent === 0 &&
            <AddLinkModalContent linkList={this.state.linkList} toBeAddedLinkList={this.state.toBeAddedLinkList}
              selectLinkToAdd={::this.selectLinkToAdd} addLinkToWidget={::this.addLinkToWidget} closeModal={::this.closeModal}
            />
          }
          { this.state.modalContent === 1 &&
            <AddTabModalContent link_linkList={this.state.linkList} link_toBeAddedLinkList={this.state.toBeAddedLinkList}
              link_selectLinkToAdd={::this.selectLinkToAdd} link_addLinkToWidget={::this.addLinkToWidget} closeModal={::this.closeModal}
              feed_feedList={this.state.feedList}
            />
          }

          { typeof this.state.modalContent === 'object' &&
            this.state.modalContent
          }
        </Modal>
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
