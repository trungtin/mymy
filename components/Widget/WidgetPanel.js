import React, {PropTypes} from 'react';
import {FABButton, Icon, Tooltip} from 'react-mdl';
import LinkList from '../LinkList';
import './WidgetPanel.scss';
import { FeedsReadingModalContent } from './ModalContent';
import _feedElement from './lib/feedElement';
import {requestNext} from './lib/util';

const WidgetPanel = (props) => {
  const feedElement = (feed, index, feeds) => _feedElement(feed, index, () => {
    let _index = index;
    props.openModal(event, {element: (
      <FeedsReadingModalContent article={feed} requestNext={() => {
        const nextFeed = requestNext(feeds, _index++);
        if (!nextFeed) {
          return false;
        }
        return nextFeed;
      }}/>
      )}, props.tabKey);
  }, props.content.url, <Tooltip label="Partial Content" style={{cursor: 'pointer'}}><Icon name="border_style"/></Tooltip>);

  return (
      <div className="widget-panel">
        { props.content.type === 'link' &&
          <section className="card__main-panel">
            <LinkList data={props.content.data || []} />
            <FABButton mini colored raised ripple style={{display: 'inline-block', margin: 8, width: 48, height: 48}} onClick={(event) => props.openModal(event, {element: 0}, props.tabKey)}>
              <Icon name="add" ripple/>
            </FABButton>
          </section>
        }
        { props.content.type === 'feed' &&
          <section className="card__main-panel">
            {props.content.data.map(feedElement)}
            <small>--- End of feeds ---</small>
          </section>
        }
      </div>
    );
};

WidgetPanel.propTypes = {
  content: PropTypes.object.isRequired,
  openModal: PropTypes.func,
  tabKey: PropTypes.string,
};

export default WidgetPanel;
