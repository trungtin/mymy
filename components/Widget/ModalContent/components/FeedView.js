import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';
import './FeedView.scss';
import fetchFeed from '../../lib/fetchFeed';
import FeedsReadingModalContent from '../FeedsReadingModalContent';
import {Icon, Spinner} from 'react-mdl';
import _feedElement from '../../lib/feedElement';

export default class FeedView extends Component {
  static propTypes = {
    feedList: PropTypes.array,
    linkList: PropTypes.array,
    openModal: PropTypes.func,
    onFeedPreview: PropTypes.func.isRequired,
  };
  constructor() {
    super();
    this.state = {
      selectedFeed: undefined,
      selectedSubFeedObj: undefined,
      fetchedFeed: {data: []},
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState !== this.state || nextProps.feedList !== this.props.feedList || nextProps.linkList !== this.props.linkList);
  }

  componentWillUpdate(nextProps, nextState) {
    console.log(nextState.selectedSubFeedObj, this.state.selectedSubFeedObj);
    if (nextState.selectedSubFeedObj && nextState.selectedSubFeedObj !== this.state.selectedSubFeedObj) {
      fetchFeed(nextState.selectedSubFeedObj.url).then(feed => {
        console.log('feed: ', feed)
        this.setState({fetchedFeed: feed});
        this.forceUpdate();
      });
    }
  }

  componentDidUpdate() {
    const ssfo = this.state.selectedSubFeedObj;
    if (ssfo) {
      ssfo.name ?
        this.props.onFeedPreview({name: this.state.selectedFeed.toUpperCase() + ' ' + ssfo.name.toUpperCase(), url: ssfo.url, location: ssfo.location})
        : this.props.onFeedPreview({name: this.state.selectedFeed.toUpperCase(), url: ssfo.url, location: ssfo.location});
    }
  }

  render() {
    console.log('render: ', this.state.fetchedFeed)
    const feedElement = (feed, index) => _feedElement(feed, index, () => {
      this.props.openModal(event, {element: (
        <FeedsReadingModalContent title={feed.title} article={feed.summary} mainImgSrc={feed.image.url} />
        )}, null, null, true);
    }, this.state.fetchedFeed.url);
    return (<div className="feed-view-wrapper">
      <section className="feed-view">
        {
          Object.keys(this.props.feedList).map((feedName, index) => {
            if (typeof this.props.feedList[feedName] !== 'object') {
              return;
            }
            const isStacking = Object.keys(this.props.feedList[feedName]).length > 2;
            const feedClassName = classNames({'stacking-layer': isStacking});
            const link = this.props.linkList[feedName];
            return (<div style={{display: 'inline-block'}}>
                <div key={`link-${index}`} id={'feed-' + index} className={feedClassName}
                  style={{position: 'relative', cursor: 'pointer', display: 'inline-block', margin: 8, width: 48, height: 48}}
                  onClick={() => {
                    if (!isStacking) {
                      const subFeed = Object.keys(this.props.feedList[feedName]).filter(name => name !== 'meta')[0];
                      return this.setState({selectedFeed: feedName,
                        fetchedFeed: null,
                        selectedSubFeedObj: {...this.props.feedList[feedName][subFeed], location: `${feedName}#${subFeed}`},
                      });
                    }
                    return this.setState({selectedFeed: feedName,
                      selectedSubFeedObj: undefined,
                      fetchedFeed: null,
                    });
                  }}>
                  <img src={link && (link.icon || link.url && '//' + link.url.match(/[a-z0-9\.]+/i)[0] + '/apple-touch-icon.png')}
                    style={{width: 48, height: 48}} alt={feedName} />
                </div>
              </div>
           );
          })
        }
      </section>
      { this.state.selectedSubFeedObj && !this.state.fetchedFeed &&
        <div style={{textAlign: 'center'}}><Spinner /></div>
      }
      { this.state.selectedFeed &&
        <section className="feed-view__info-wrapper">
        { Object.keys(this.props.feedList[this.state.selectedFeed]).length > 2 &&
          <div className="feed-view__sub-feed-selector">
            <ul className="feed-view__sub-feed-selector-content">
              {Object.keys(this.props.feedList[this.state.selectedFeed]).filter(name => name !== 'meta').map(subFeed =>
                <li onClick={() => this.setState({
                  fetchedFeed: null,
                  selectedSubFeedObj: {
                    ...this.props.feedList[this.state.selectedFeed][subFeed],
                    name: subFeed,
                    location: `${this.state.selectedFeed}#${subFeed}`,
                  },
                })}>
                  {subFeed}
                </li>
              )}
            </ul>
          </div>
        }
        {
          this.state.fetchedFeed && !!this.state.fetchedFeed.data.length &&
          <div className="feed-view__info">
            <div className="feed-view__info-content">
              {this.state.fetchedFeed.data.map(feedElement)}
            </div>
            <i className="material-icons" style={{position: 'absolute', top: 0, right: 0}}>expand_less</i>
            <i className="material-icons" style={{position: 'absolute', bottom: 0, right: 0}}>expand_more</i>
          </div>
        }
        </section>
      }
    </div>);
  }
}
