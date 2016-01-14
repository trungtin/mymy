import React, {PropTypes} from 'react';
import './FeedsReadingModalContent.scss';
import EventListener from 'fbjs/lib/EventListener';

const SCROLL_HEIGHT_LOAD_NEXT = 0.85;

const onScroll = (element, callback) => {
  let isCalled = false;
  return {
    onScollCall: () => {
      if (!isCalled && typeof callback === 'function') {
        const scrollHeight = element.scrollHeight;
        const clientHeight = element.clientHeight;
        const scrollTopOffset = SCROLL_HEIGHT_LOAD_NEXT * (scrollHeight - clientHeight);
        if (element.scrollTop >= scrollTopOffset) {
          isCalled = true;
          callback();
        }
      }
    },
    resetScrollCall: () => {
      isCalled = false;
    },
  };
};

export default class FeedsReadingModalContent extends React.Component {
  static propTypes = {
    article: PropTypes.object,
    requestNext: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      additionArticle: [],
    };
  }

  componentDidMount() {
    const articleWrapper = this.refs.articleWrapper;
    const {onScollCall, resetScrollCall} = onScroll(articleWrapper, ::this.loadMoreContent);
    this.resetScrollCall = resetScrollCall;

    // Kickstart load next article if first article height is smaller than wrapper DOM element (not scrollable).
    if (articleWrapper.scrollHeight <= articleWrapper.clientHeight) {
      onScollCall();
    }
    this.onScrollEvent = articleWrapper.addEventListener('scroll', onScollCall, false);

    this.iframeUrlMapping = new Map([]);
    this.yqlScriptMapping = new Map([]);

    // YQL scrape iframe
    const loadHTML = (html, iframeUrl) => {
      const iframe = this.iframeUrlMapping.get(iframeUrl);

      if (iframe) {
        iframe.src = 'about:blank';
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(
          html.replace(/<head>/i,
            '<head><base href="' + iframeUrl + '"><scr' +
            'ipt>document.addEventListener("click", function(e) { if(e.target && e.target.nodeName == "A") { e.preventDefault(); parent.loadURL(e.target.href); } });</scr' +
            'ipt>'));
        iframe.contentWindow.document.close();

        iframe.addEventListener('load', (event) => {
          const _iframe = event.target;
          const childIframe = _iframe.contentDocument.body.getElementsByTagName('iframe')[0];
          if (childIframe) {
            childIframe.addEventListener('load', (cEvent) => {
              const childHeight = cEvent.target.contentDocument.body.scrollHeight + 'px';
              cEvent.target.style.height = childHeight;
              _iframe.style.height = childHeight;
            });
          }
          // if childIframe is already loaded the same time as _iframe or childIframe isn't exist.
          if ( !_iframe.style.height ) {
            _iframe.style.height = _iframe.contentDocument.body.scrollHeight + 'px';
          }
        });
      }
    };

    window.getData = (data) => {
      const script = this.yqlScriptMapping.get(data.query.results && data.query.results.resources.url || data.diagnostics.url[1].content);
      ~Array.prototype.indexOf.call(document.body.childNodes, script) && document.body.removeChild(script);
      this.yqlScriptMapping.delete(data.query.results && data.query.results.resources.url || data.diagnostics.url[1].content);

      if (data && data.query && data.query.results && data.query.results.resources && data.query.results.resources.content && data.query.results.resources.status == 200) {
        loadHTML(data.query.results.resources.content, data.query.results.resources.url);
      } else if (data && data.error && data.error.description) {
        loadHTML(data.error.description, data.diagnostics.url[1].content);
      } else {
        loadHTML('Error: Cannot load this iframe.');
      }
    };

    this.loadURL = (src) => {
      const script = document.createElement('script');
      script.src = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.headers%20where%20url%3D%22' +
        encodeURIComponent(src) + '%22&format=json&diagnostics.url[1].content=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=getData';
      document.body.appendChild(script);
      this.yqlScriptMapping.set(src, script);
    };

    this.editIframeContent();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.additionArticle !== this.state.additionArticle) {
      this.resetScrollCall();
    }
    this.editIframeContent();
  }

  componentWillUnmount() {
    this.refs.articleWrapper.removeEventListener('scroll', this.onScrollEvent);
  }

  loadMoreContent() {
    if (typeof this.props.requestNext === 'function') {
      const next = this.props.requestNext();
      if (!next) {
        return;
      }
      this.setState({additionArticle: [...this.state.additionArticle, next]});
    }
  }

  editIframeContent() {
    const articleNodeList = this.refs.articleWrapper.getElementsByClassName('feed-reading__wrapper unedited-iframe-content');
    const eventMapping = new Map([]);
    const self = this;
    function iframeLoaded(event) {
      const iframe = event.target;
      if (!iframe.contentDocument || iframe.contentDocument.body.innerHTML !== '') {
        return;
      }
      const url = iframe.src;

      self.iframeUrlMapping.set(url, iframe);

      self.loadURL(url);

      if (eventMapping.has(event.target)) {
        eventMapping.get(event.target).remove();
        eventMapping.delete(event.target);
      }
    }
    Array.prototype.slice.call(articleNodeList).forEach(article => {
      const iframeNodeList = article.getElementsByTagName('iframe');

      Array.prototype.slice.call(iframeNodeList).forEach(_iframe => {
        if (_iframe.contentDocument.readyState === 'complete') {
          iframeLoaded({target: _iframe});
        } else {
          const loadEvent = EventListener.listen(_iframe, 'load', iframeLoaded);
          eventMapping.set(_iframe, loadEvent);
        }
      });
      article.classList.remove('unedited-iframe-content');
    });
  }

  render() {
    const article = ({title, author, image, summary, date, meta} = {}) => {
      const fixedSummary = summary && summary.replace(/src=\"\//gim, `src="${meta.link}/`);
      return (
        <article className="feed-reading__wrapper unedited-iframe-content">
          <h4 className="feed-reading__title">{title}</h4>
          <em>By {author} | {date.toDateString()}</em>
          <br/><br/><br/>
          <img src={image && (image.link || image.url)} alt=""/>
          <section dangerouslySetInnerHTML={{ __html: fixedSummary}} className="feed-reading__content" />
        </article>);
    };

    return (
      <div style={{overflow: 'auto', width: '100%'}} ref="articleWrapper">
        {article(this.props.article)}
        <em>From the same channel: </em>
        { !!this.state.additionArticle.length &&
          this.state.additionArticle.map(art => art && article(art))
        }
      </div>
      );
  }
}
