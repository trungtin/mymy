import React, {PropTypes, Component} from 'react';
import WidgetTitleMenu from './WidgetTitleMenu';
import WidgetPanel from './WidgetPanel';
import {Card, Spinner} from 'react-mdl';
import WidgetResizer from './WidgetResizer';
import fetchFeed from './lib/fetchFeed';

export default class Widget extends Component {
  static propTypes = {
    data: PropTypes.object,
    widgetKey: PropTypes.string,
    openModal: PropTypes.func,
    editLayout: PropTypes.bool,
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
    console.log(nextProps);
    const widgetPanelContent = (nextProps && nextProps.data || this.props.data)[Object.keys(this.props.data)[tabId]];
    if (widgetPanelContent) {
      if (widgetPanelContent.type === 'feed') {
        this.setState({fetchingFeed: true});
        this._fetchFeed(widgetPanelContent.data.url, tabId);
      } else if (widgetPanelContent.type === 'link') {
        this.setState({widgetPanelContent, tabId, fetchingFeed: false});
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
      this.setState({widgetPanelContent: feed, tabId, fetchingFeed: false});
    });
  }

  render() {
    console.log('widget %s render', this.props.widgetKey)
    return (
      <Card shadow={0} style={{overflow: 'visible'}}>
        <WidgetTitleMenu tabs={this.props.data && Object.keys(this.props.data)}
          onTabChange={(tabId) => this._updatePanelContent(tabId)} openModal={(event, modalContent) => this.props.openModal(event, modalContent, this.props.widgetKey, null)}
          widgetKey={this.props.widgetKey}/>
        { this.state.fetchingFeed &&
          <div style={{textAlign: 'center'}}><Spinner /></div>
        }
        { !this.state.fetchingFeed && this.props.data && !!Object.keys(this.props.data).length &&
          <WidgetPanel content={this.state.widgetPanelContent}
            openModal={(event, modalContent, tabKey) => this.props.openModal(event, modalContent, this.props.widgetKey, tabKey)}
            tabKey={this.props.data && Object.keys(this.props.data)[this.state.tabId]} editLayout={this.props.editLayout} />
        }
        { this.props.editLayout &&
          <WidgetResizer widgetKey={this.props.widgetKey}/>
        }
      </Card>
    );
  }
}

