import React, {PropTypes} from 'react';
import {FABButton, Icon} from 'react-mdl';
import LinkList from '../LinkList';
import './WidgetPanel.scss';
import { FeedsReadingModalContent } from './ModalContent';
import _feedElement from './lib/feedElement';

const WidgetPanel = (props) => {
  const feedElement = (feed, index) => _feedElement(feed, index, () => {
    props.openModal(event, {element: (
      <FeedsReadingModalContent title={feed.title} article={feed.summary} mainImgSrc={feed.image.url} />
      )}, props.tabKey);
  }, props.content.url);

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
  editLayout: PropTypes.bool,
};

export default WidgetPanel;
