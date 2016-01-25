import React, {PropTypes, Component} from 'react';
import WidgetTitleMenu from './WidgetTitleMenu';
import WidgetPanel from './WidgetPanel';
import {Card, Spinner} from 'react-mdl';
import fetchFeed from './lib/fetchFeed';

const othersComponent = new Map();
othersComponent.set('calendar', '../Calendar/Calendar');

export default class Widget extends Component {
  static propTypes = {
    data: PropTypes.object,
    widgetKey: PropTypes.string.isRequired,
    openModal: PropTypes.func.isRequired,
    size: PropTypes.array.isRequired,
    hideTabbar: PropTypes.bool
  }
  constructor() {
    super();
    this.state = {
      tabId: 0,
      widgetPanelContent: {data: <div>Loading</div>},
      fetchingFeed: false,
    };
    this.fetchedFeeds = [];
  }

  componentDidMount() {
    this._updatePanelContent(this.state.tabId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this._updatePanelContent(this.state.tabId, nextProps);
    }
  }

  _updatePanelContent(tabId, nextProps) {
    const widgetPanelContent = (nextProps && nextProps.data || this.props.data)[Object.keys(this.props.data)[tabId]];
    if (widgetPanelContent) {
      if (widgetPanelContent.type === 'feed' && widgetPanelContent.data.url) {
        this.setState({widgetPanelContent, fetchingFeed: true});
        this._fetchFeed(widgetPanelContent.data.url, tabId);
      } else if (widgetPanelContent.type === 'link' || (widgetPanelContent.type === 'feed' && widgetPanelContent.data.__html)) {
        this.setState({widgetPanelContent, tabId, fetchingFeed: false});
      } else if (othersComponent.get(widgetPanelContent.type)) {
        require.ensure([], require => {
          const _Component = require('../Calendar/Calendar');
          this.setState({widgetPanelContent: _Component, tabId, fetchingFeed: false});
        });
      }
    }
  }

  _fetchFeed(feedUrl, tabId) {
    const fetchedFeed = this.fetchedFeeds[tabId];
    if (fetchedFeed && fetchedFeed.fetchedAt + 600000 < Date.now()) {
      return this.setState({widgetPanelContent: fetchedFeed, tabId, fetchingFeed: false});
    }

    fetchFeed(feedUrl).then(feed => {
      this.fetchedFeeds[tabId] = feed;
      this.setState({widgetPanelContent: {...this.state.widgetPanelContent, ...feed}, tabId, fetchingFeed: false});
    });
  }

  render() {
    return (
      <Card shadow={0} style={{overflow: 'visible'}}>
        <WidgetTitleMenu tabs={this.props.data && Object.keys(this.props.data)}
          onTabChange={(tabId) => this._updatePanelContent(tabId)} openModal={(event, modalContent) => this.props.openModal(event, modalContent, this.props.widgetKey, null)}
          widgetKey={this.props.widgetKey} size={this.props.size} hideTabbar={this.props.hideTabbar}/>
        { this.state.fetchingFeed &&
          <div style={{textAlign: 'center'}}><Spinner /></div>
        }
        { !this.state.fetchingFeed && this.props.data && !!Object.keys(this.props.data).length &&
          (typeof this.state.widgetPanelContent === 'function' &&
            <this.state.widgetPanelContent /> ||
            <WidgetPanel content={this.state.widgetPanelContent}
              openModal={(event, modalContent, tabKey) => this.props.openModal(event, modalContent, this.props.widgetKey, tabKey)}
              tabKey={this.props.data && Object.keys(this.props.data)[this.state.tabId]} />
          )
        }
      </Card>
    );
  }
}

