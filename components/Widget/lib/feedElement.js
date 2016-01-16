import React from 'react';
import {Icon, Tooltip} from 'react-mdl';

function getSummary(summary, readMore) {
  const summaryEl = document.createElement('div');
  summaryEl.innerHTML = summary;
  const textContent = summaryEl.textContent;
  if (textContent.length > 210) {
    return <span>{textContent.slice(0, 200) + textContent.slice(200, 210).match(/\w*?[\W]/i) + '...'}{readMore && <a onClick={readMore} style={{cursor: 'pointer'}}> Read more</a>}</span>;
  }
  return <span>{textContent}</span>;
}

export default (feed, index, onFeedClick, feedHomepage, prependIcon, appendIcon) => {
  const readMore = (event) => {
    event.preventDefault();
    onFeedClick && onFeedClick();
  };
  return (
  <div key={index} className="feed-post">
    <section style={{width: `calc(100% - 48px)`, float: 'left'}}>
      {!!prependIcon &&
        <div className="feed-post__prepend-icon" onClick={readMore}>{prependIcon}</div>
      }
      <a href="#" className="feed-post__title"
        style={{width: `calc(100% - ${(prependIcon ? 24 : 0) + (appendIcon ? 24 : 0)}px)`}}
        onClick={(event) => {
          event.preventDefault();
          let self = event.target;
          if (self.tagName !== 'A') {
            self = self.parentNode;
          }
          self.classList.toggle('expanded-summary');
        }}
      ><h6>{feed.title}</h6></a>
      <div className="feed-post__summary">{ getSummary(feed.summary || feed.description, readMore) }</div>
      {!!appendIcon &&
        <div className="feed-post__append-icon">{appendIcon}</div>
      }
    </section>
    <div className="feed-post__out-link">
      <a href="#"><Tooltip label="Save"><Icon name="bookmark_border" /></Tooltip></a>
      <a href={(!feedHomepage || ~feed.guid.indexOf(feedHomepage)) && feed.guid || '//' +
        (feed.guid.startsWith('/') && feedHomepage.slice(0, -1) + feed.guid || feedHomepage + feed.guid)}
        ><Tooltip label="Direct link"><Icon name="launch" /></Tooltip></a>
    </div>
  </div>);
};
