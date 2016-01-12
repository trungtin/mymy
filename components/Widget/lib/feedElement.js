import React from 'react';
import {Icon, Tooltip} from 'react-mdl';

export default (feed, index, onFeedClick, feedHomepage, prependIcon, appendIcon) => {
  return (
  <div key={index} className="feed-post">
    <section style={{width: `calc(100% - 24px)`, float: 'left'}}>
      {!!prependIcon &&
        <div className="feed-post__prepend-icon">{prependIcon}</div>
      }
      <a href="#" className="feed-post__title"
        style={{width: `calc(100% - ${(prependIcon ? 24 : 0) + (appendIcon ? 24 : 0)}px)`}}
        onClick={(event) => {
          event.preventDefault();
          onFeedClick && onFeedClick(event);
        }}
      ><h6>{feed.title}</h6></a>
      {!!appendIcon &&
        <div className="feed-post__append-icon">{appendIcon}</div>
      }
    </section>
    <a href={(!feedHomepage || ~feed.guid.indexOf(feedHomepage)) && feed.guid || '//' +
      (feed.guid.startsWith('/') && feedHomepage.slice(0, -1) + feed.guid || feedHomepage + feed.guid)}
      className="feed-post__out-link"><Tooltip label="Direct link"><Icon name="launch" /></Tooltip></a>
  </div>);
};
