import React, {PropTypes} from 'react';
import { findDOMNode } from 'react-dom';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

function execBodyScripts(parentElement, _script) {
  // Finds and executes scripts in a newly added element's body.
  // Needed since innerHTML does not run scripts.
  //
  // Argument parentElement is an element in the dom.

  function nodeName(elem, name) {
    return elem.nodeName && elem.nodeName.toUpperCase() ===
              name.toUpperCase();
  }

  function evalScript(elem, parentEl, nextSibling) {
    const data = (elem.text || elem.textContent || elem.innerHTML || '' );
    const script = document.createElement('script');

    script.type = 'text/javascript';
    try {
      // doesn't work on ie...
      script.appendChild(document.createTextNode(data));
    } catch (error) {
      // IE has funky script nodes
      script.text = data;
    }
    nextSibling ? parentEl.insertBefore(script, nextSibling) : parentEl.appendChild(script);
  }

  // main section of function
  let scripts = [];
  let script;
  const childrenNodes = parentElement.childNodes;
  let child;

  for (let index = 0; childrenNodes[index]; index++) {
    child = childrenNodes[index];
    if (nodeName(child, 'script' ) && (!child.type || child.type.toLowerCase() === 'text/javascript')) {
      scripts.push(child);
    }
  }

  scripts = scripts.concat(_script);

  for (let index = 0; scripts[index]; index++) {
    script = scripts[index];
    const nextSibling = script.nextSibling;
    if (script.parentElement === parentElement) {
      parentElement.removeChild(script);
    }

    evalScript(script, parentElement, nextSibling);
  }
}

export default class EmbeddedContent extends React.Component {
  static propTypes = {
    __html: PropTypes.string.isRequired,
  }

  componentDidMount() {
    const twitterScript = document.getElementById('twitter-wjs');
    if (twitterScript) {
      twitterScript.parentNode.removeChild(twitterScript);
    }
    const clientRect = findDOMNode(this).getBoundingClientRect();
    const __html = this.props.__html.replace(new RegExp('\\$\\{w\\}', 'g'), Number.parseInt(clientRect.width, 10)).replace(new RegExp('\\$\\{h\\}', 'g'), Number.parseInt(clientRect.height, 10));

    const embedScript = [];

    try {
      if (~__html.indexOf('facebook.com')) {
        const script = document.createElement('script');
        script.appendChild(document.createTextNode(`!function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk')`));
        canUseDOM && embedScript.push(script);
      }
    } catch (error) {
      // nothing
    }

    this.refs.anchor.innerHTML = __html;
    execBodyScripts(this.refs.anchor, embedScript);
    try {
      if (FB) {
        FB.XFBML.parse(this.refs.anchor);
      }
      if (twttr) {
        twttr.widgets.load(this.refs.anchor);
      }
    } catch (error) {
      // catching FB not defined.
    }
  }

  render() {
    return (
      <div ref="anchor" style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, textAlign: 'center'}}></div>
      );
  }
}
