import React, {PropTypes, Component} from 'react';
import WidgetTitleMenu from './WidgetTitleMenu';
import WidgetPanel from './WidgetPanel';
import {Card, Icon} from 'react-mdl';
import WidgetResizer from './WidgetResizer';
import request from 'superagent';
import FeedParser from 'feedparser';
import strToStream from 'string-to-stream';

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

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.editLayout !== this.props.editLayout) {
      return true;
    }
    if (nextProps.data === this.props.data && nextState === this.state) {
      return false;
    }
    return true;
  }

  _updatePanelContent(tabId) {
    const widgetPanelContent = this.props.data[Object.keys(this.props.data)[tabId]];
    if (widgetPanelContent.type === 'feed') {
      this.setState({fetchingFeed: true});
      this._fetchFeed(widgetPanelContent.data.url, tabId);
    } else if (widgetPanelContent.type === 'link') {
      this.setState({widgetPanelContent, tabId, fetchingFeed: false});
    }
  }

  _fetchFeed(feedUrl, tabId) {
    const fetchedFeed = this.fetchedFeeds[tabId];
    if (fetchedFeed && fetchedFeed.fetchedAt + 600000 < Date.now()) {
      return this.setState({widgetPanelContent: fetchedFeed, tabId, fetchingFeed: false});
    }
    const parser = new FeedParser();
    const feed = {data: [], fetchedAt: Date.now(), type: 'feed'};
    request.get(feedUrl)
      .end((err, res) => {
        if (err) {
          return console.log('Request feed data error: ', err);
        }
        strToStream(res.text).pipe(parser);
      });
    parser
      .on('error', (error) => {
        console.log('Parse feed error: ', error);
      })
      .on('readable', function parserReadable() {
        const stream = this;
        // const meta = this.meta;
        let item = stream.read();

        while (item) {
          feed.data.push(item);
          item = stream.read();
        }
      })
      .on('end', () => {
        this.fetchedFeeds[tabId] = feed;
        this.setState({widgetPanelContent: feed, tabId, fetchingFeed: false});
      });
  }

  render() {
    console.log('widget render')
    return (
      <Card shadow={0} style={{overflow: 'visible'}}>
        <WidgetTitleMenu tabs={this.props.data && Object.keys(this.props.data)}
          onTabChange={(tabId) => this._updatePanelContent(tabId)} openModal={(event, modalContent) => this.props.openModal(event, modalContent, this.props.widgetKey, null)}/>
        { this.state.fetchingFeed &&
          <div style={{textAlign: 'center'}}><Icon name="autorenew"/></div>
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

