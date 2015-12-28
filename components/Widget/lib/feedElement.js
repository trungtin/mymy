import React from 'react';
import {Icon} from 'react-mdl';

export default (feed, index, onFeedClick, feedHomepage) => {console.log(feedHomepage); return (

  <div key={index} className="feed-post">
    <a href="#" className="feed-post__title" onClick={(event) => {
      event.preventDefault();
      onFeedClick && onFeedClick();
    }}><h6>{feed.title}</h6></a>
    <a href={(!feedHomepage || ~feed.guid.indexOf(feedHomepage)) && feed.guid || '//' + (feed.guid.startsWith('/') && feedHomepage.slice(0, -1) + feed.guid || feedHomepage + feed.guid)}
      className="feed-post__out-link"><Icon name="launch" /></a>
  </div>
)};
