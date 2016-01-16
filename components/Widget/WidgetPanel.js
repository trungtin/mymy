import React, {PropTypes} from 'react';
import {FABButton, Icon, Tooltip} from 'react-mdl';
import LinkList from '../LinkList';
import './WidgetPanel.scss';
import { FeedsReadingModalContent } from './ModalContent';
import _feedElement from './lib/feedElement';
import {requestNext} from './lib/util';
import EmbeddedContent from './EmbeddedContent';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import classNames from 'classnames';

const WidgetPanel = (props) => {
  const feedElement = (feed, index, feeds) => _feedElement(feed, index, (event) => {
    let _index = index;
    !props.content.partial_content && props.openModal(event, {element: (
      <FeedsReadingModalContent article={feed} meta={props.content.meta} requestNext={() => {
        const nextFeed = requestNext(feeds, _index++);
        if (!nextFeed) {
          return false;
        }
        return nextFeed;
      }}/>
      )}, props.tabKey);
  }, props.content.url, <Tooltip label={`${props.content.partial_content ? 'Partial' : 'Full'} Content`} style={{cursor: 'pointer'}}><Icon name={props.content.partial_content ? 'border_style' : 'check_box_outline_blank'}/></Tooltip> || undefined);

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
          <section className={classNames({'card__main-panel': true, 'card__main-panel__embedded': !!props.content.data.__html})}>
            { Array.isArray(props.content.data) && props.content.data.map(feedElement)}
            { !!props.content.data.__html && ( canUseDOM && <EmbeddedContent key={props.tabKey} __html={props.content.data.__html}/> ) ||
              <small>--- End of feeds ---</small>
            }
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
