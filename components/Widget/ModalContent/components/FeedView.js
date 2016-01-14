import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';
import './FeedView.scss';
import fetchFeed from '../../lib/fetchFeed';
import FeedsReadingModalContent from '../FeedsReadingModalContent';
import {Grid, Cell, Spinner, Icon, Button, Textfield, Tooltip as TooltipMDL} from 'react-mdl';
import _feedElement from '../../lib/feedElement';
import Tooltip from '../../../Tooltip';
import {findDOMNode} from 'react-dom';
import EmbeddedContent from '../../EmbeddedContent';

export default class FeedView extends Component {
  static propTypes = {
    feedList: PropTypes.object,
    linkList: PropTypes.object,
    openModal: PropTypes.func,
    onFeedPreview: PropTypes.func.isRequired,
  };
  constructor() {
    super();
    this.initialState = {
      selectedFeed: undefined,
      selectedSubFeedObj: undefined,
      fetchedFeed: null,
      subFeedSupplyData: undefined,
      requiredDataSubFeed: null,
    };
    this.state = this.initialState;
    this.supplyDataTemp = [];
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState !== this.state || nextProps.feedList !== this.props.feedList || nextProps.linkList !== this.props.linkList);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.selectedSubFeedObj && nextState.selectedSubFeedObj !== this.state.selectedSubFeedObj ) {
      if (nextState.selectedSubFeedObj.url) {
        fetchFeed(nextState.selectedSubFeedObj.url).then(feed => {
          this.setState({fetchedFeed: feed});
          this.forceUpdate();
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedSubFeedObj && this.state.selectedSubFeedObj !== prevState.selectedSubFeedObj) {
      const {name, ...rest} = this.state.selectedSubFeedObj;
      name ?
        this.props.onFeedPreview({name: this.state.selectedFeed.toUpperCase() + ' ' + name.toUpperCase(), ...rest})
        : this.props.onFeedPreview({name: this.state.selectedFeed.toUpperCase(), ...rest});
    }
  }

  onSubFeedSelect(subFeedName, feedName = this.state.selectedFeed, notUsingName) {
    const subFeedObj = this.props.feedList[feedName][subFeedName];
    const isRequire = (subFeedObj.require && !!subFeedObj.require.length) ? 'requiredDataSubFeed' : 'selectedSubFeedObj';
    return this.setState({
      ...this.initialState,
      fetchedFeed: null,
      selectedFeed: feedName || this.state.selectedFeed,
      [isRequire]: {
        ...subFeedObj,
        partial_content: this.props.linkList[feedName].partial_content,
        name: notUsingName ? undefined : subFeedName,
        location: `${feedName || this.state.selectedFeed}#${subFeedName}`,
      },
    });
  }

  render() {
    const feedElement = (feed, index) => _feedElement(feed, index, (event) => {
      !this.state.selectedSubFeedObj.partial_content && this.props.openModal(event, {element: (
        <FeedsReadingModalContent key={feed.guid} article={feed}/>
        )}, null, null, true);
    }, this.state.fetchedFeed.url, this.state.selectedSubFeedObj.partial_content && <TooltipMDL label="Partial Content" style={{cursor: 'pointer'}}><Icon name="border_style"/></TooltipMDL> || undefined);
    return (<Grid className="feed-view-wrapper">
      <Cell col={12}>
        <section className="feed-view">
          {
            Object.keys(this.props.feedList).map((feedName, index) => {
              if (typeof this.props.feedList[feedName] !== 'object') {
                return;
              }
              const isStacking = Object.keys(this.props.feedList[feedName]).length > 1;
              const feedClassName = classNames({'stacking-layer': isStacking}, 'feed-view__thumbnail');
              const link = this.props.linkList[feedName];
              return (<div key={feedName} style={{display: 'inline-block'}}>
                  <div key={`link-${index}`} id={'feed-' + index} className={feedClassName}
                    style={{position: 'relative', cursor: 'pointer', display: 'inline-block', margin: 8, width: 48, height: 48}}
                    onClick={() => {
                      if (!isStacking) {
                        const subFeed = Object.keys(this.props.feedList[feedName])[0];
                        return this.onSubFeedSelect(subFeed, feedName, true);
                      }
                      return this.setState({
                        ...this.initialState,
                        selectedFeed: feedName,
                      });
                    }}>
                    <img src={link && (link.icon || link.url && link.url.match(/\/\/[a-z0-9\.]+/i)[0] + '/apple-touch-icon.png')}
                      style={{width: 48, height: 48}} alt={feedName} />
                  </div>
                </div>
             );
            })
          }
        </section>
        { this.state.selectedSubFeedObj && !(this.state.selectedSubFeedObj.__html || this.state.fetchedFeed) &&
          <div style={{textAlign: 'center'}}><Spinner /></div>
        }
        { this.state.selectedFeed &&
          <section className="feed-view__info-wrapper">
          <Tooltip color="rgba(214, 214, 214, 0.5)" content={(() => {
            const rq = this.state.requiredDataSubFeed && this.state.requiredDataSubFeed.require;
            if (!rq) return null;
            return (<div>
              {Array.isArray(rq) && rq.map((req, index) =>
                <Textfield label={req} style={{color: 'black'}} key={req} ref={(field) => {
                  const input = field && findDOMNode(field).getElementsByTagName('input')[0];
                  if (index === 0) {
                    this.supplyDataTemp = [input];
                    return;
                  }
                  this.supplyDataTemp[index] = input;
                }}/>
              )}
              <div>
                <Button raised accent ripple onClick={() => {
                  const supplyData = this.supplyDataTemp.map(input => input.value);
                  const selectedSubFeedObj = {};
                  Object.keys(this.state.requiredDataSubFeed).filter(key => key !== 'require').forEach(key => {
                    let extractValue = this.state.requiredDataSubFeed[key];
                    rq.forEach((rqKey, index) =>
                      extractValue = typeof extractValue === 'string' ? extractValue.replace(new RegExp('\\$\\{' + index + '\\}', 'g'), supplyData[index]) : extractValue);
                    selectedSubFeedObj[key] = extractValue;
                  });
                  selectedSubFeedObj.supplyData = supplyData;
                  this.setState({selectedSubFeedObj, requiredDataSubFeed: null});
                }}>Preview</Button>
                <Button style={{color: '#3F51B5'}} onClick={() => this.setState({requiredDataSubFeed: null})}>Cancel</Button>
              </div>
              </div>);
          })()
          } position="nw"/>
          <div className="feed-view__info-close" onClick={() => this.setState(this.initialState)}><Icon name="clear" /></div>
          { (Object.keys(this.props.feedList[this.state.selectedFeed]).length > 1 || this.state.requiredDataSubFeed) &&
            <div className="feed-view__sub-feed-selector">
              <ul className="feed-view__sub-feed-selector-content">
                {Object.keys(this.props.feedList[this.state.selectedFeed]).map(subFeed =>
                  <li key={subFeed} onClick={() => this.onSubFeedSelect(subFeed)}>
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
          {
            this.state.selectedSubFeedObj && this.state.selectedSubFeedObj.__html &&
            <div className="feed-view__info">
              <div className="feed-view__info-content">
                <EmbeddedContent __html={this.state.selectedSubFeedObj.__html} />
              </div>
            </div>
          }
          </section>
        }
      </Cell>
    </Grid>);
  }
}
