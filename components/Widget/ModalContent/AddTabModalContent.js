import React, {PropTypes, Component} from 'react';
import {Cell, Grid, Tabs, Tab} from 'react-mdl';
import {ModalContentSidebar} from './';
import LinkView from './components/LinkView';
import FeedView from './components/FeedView';

const checkMark = (<div className="checkmark"></div>);

export default class AddTabModalContent extends Component {

  static propTypes = {
    link_linkList: PropTypes.array,
    link_selectLinkToAdd: PropTypes.func,
    link_addLinkToWidget: PropTypes.func,
    closeModal: PropTypes.func,
    link_toBeAddedLinkList: PropTypes.array,
    feed_feedList: PropTypes.array,
  }

  constructor() {
    super();
    this.state = {
      tabId: 0,
    };
  }

  render() {
    return (<div>
      <Tabs ripple activeTab={0} onChange={() => {}}>
        <Tab>Link</Tab>
        <Tab>Feed</Tab>
      </Tabs>
      <section>
        <LinkView linkList={this.props.link_linkList} toBeAddedLinkList={this.props.link_toBeAddedLinkList}
          selectLinkToAdd={() => {}}/>
        <FeedView feedList={this.props.feed_feedList} />
      </section>
    </div>);
  }
}
