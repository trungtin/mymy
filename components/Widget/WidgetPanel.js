import React, {PropTypes} from 'react';
import {FABButton, Icon} from 'react-mdl';
import LinkList from '../LinkList';
import './WidgetPanel.scss';
import { FeedsReadingModalContent } from './ModalContent';

const WidgetPanel = (props) => {
  console.log(props.content.type, props.content.data);
  const feedElement = (feed, index) => (
    <div key={index} className="feed-post">
      <a href="#" className="feed-post__title" onClick={(event) => {
        event.preventDefault();
        props.openModal(event, (
          <FeedsReadingModalContent title={feed.title} article={feed.summary} mainImgSrc={feed.image.url} />
          ), props.tabKey);
      }}><h6>{feed.title}</h6></a>
      <a href={feed.guid} className="feed-post__out-link"><Icon name="launch" /></a>
    </div>
  );

  return (
      <div className="widget-panel">
        { props.content.type === 'link' &&
          <section className="card__main-panel">
            {props.content.data && props.content.data.length &&
              <LinkList data={props.content.data} />
            }
            <FABButton mini colored raised ripple style={{display: 'inline-block', margin: 8, width: 48, height: 48}} onClick={(event) => props.openModal(event, 0, props.tabKey)}>
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
  editLayout: PropTypes.bool,
};

export default WidgetPanel;
