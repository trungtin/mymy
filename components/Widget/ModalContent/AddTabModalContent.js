import React, {PropTypes, Component} from 'react';
import {Button, Tabs, Tab, Textfield} from 'react-mdl';
import LinkView from './components/LinkView';
import FeedView from './components/FeedView';
import Tooltip from '../../Tooltip';
import {findDOMNode} from 'react-dom';

function errorTooltip(error) {
  return <h6 style={{margin: 0}}>{error}</h6>;
}

export default class AddTabModalContent extends Component {

  static propTypes = {
    link_linkList: PropTypes.array,
    link_selectLinkToAdd: PropTypes.func.isRequired,
    link_addLinkTabToWidget: PropTypes.func.isRequired,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    link_toBeAddedLinkList: PropTypes.array,
    feed_feedList: PropTypes.array,
    feed_addFeedTabToWidget: PropTypes.func,
    tabList: PropTypes.array,
  }

  constructor() {
    super();
    this.state = {
      tabId: 0,
      inputError: null,
    };
    this.previewFeed = undefined;
  }

  onFeedPreview(previewFeed = {name: '', url: '', location: ''}) {
    const textField = findDOMNode(this.refs.textField);
    const input = textField.getElementsByTagName('input')[0];
    input.value = previewFeed.name;
    previewFeed.name !== '' ? textField.classList.add('is-dirty') : textField.classList.remove('is-dirty');
    this.previewFeed = previewFeed;
    console.log(previewFeed)
  }

  saveTab(event) {
    const input = findDOMNode(this.refs.textField).getElementsByTagName('input')[0];
    if (!input.value || input.value === '') {
      return this.setState({inputError: errorTooltip('New tab name may not be blank !')});
    }
    if (this.props.tabList.some((value) => value.toLowerCase() === input.value.toLowerCase())) {
      return this.setState({inputError: errorTooltip('This tab name already used !')});
    }
    if (this.state.tabId === 0) {
      this.props.link_addLinkTabToWidget(event, input.value);
    } else if (this.state.tabId === 1) {
      this.props.feed_addFeedTabToWidget(event, input.value, this.previewFeed);
    }
    this.props.closeModal();
  }

  render() {
    console.log('feed modal render')
    return (<div style={{width: '100%'}}>
      <Tabs ripple activeTab={0} onChange={(tabId) => this.setState({tabId})}>
        <Tab>Link</Tab>
        <Tab>Feed</Tab>
      </Tabs>
      <section style={{height: 'calc(100% - 8rem)'}}>
        { this.state.tabId === 0 &&
          <LinkView
            linkList={this.props.link_linkList}
            toBeAddedLinkList={this.props.link_toBeAddedLinkList}
            sortByCategory
            selectLinkToAdd={this.props.link_selectLinkToAdd}
            style={{height: '100%'}}
          />
        }
        { this.state.tabId === 1 &&
          <FeedView linkList={this.props.link_linkList} feedList={this.props.feed_feedList} openModal={this.props.openModal} onFeedPreview={::this.onFeedPreview}/>
        }
      </section>
      <div className="modal-footer">
      <Tooltip position="n" style={{position: 'relative', display: 'inline-block'}} content={this.state.inputError} color={'#e00000'}>
        <Textfield label="New tab name..." style={{marginRight: '1rem', width: 150}} className="smaller_mdl-textfield"
        ref="textField"/>
      </Tooltip>
      <Button raised colored onClick={::this.saveTab}>Save</Button>
      <Button onClick={this.props.closeModal}>Cancel</Button>
      </div>
    </div>);
  }
}
