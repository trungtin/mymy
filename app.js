import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import Location from './core/Location';
import {default as createReduxStore} from './core/redux/create';
import Layout from './containers/Layout';
import {Provider} from 'react-redux';
import DevTools from './containers/DevTools';
import {updateDB} from './core/syncDB';
import {updateLink} from './core/redux/modules/link';
import {updateFeed} from './core/redux/modules/feed';

const routes = {}; // Auto-generated on build. See tools/lib/routes-loader.js

const route = async (path, callback) => {
  const handler = routes[path] || routes['/404'];
  const component = await handler();
  const store = await createReduxStore();
  setTimeout(() => updateDB(undefined, undefined, (response, linkData, feedData) => {
    if (response.ok || response.every(arrEl => arrEl.ok)) {
      linkData && store.dispatch(updateLink(linkData));
      feedData && store.dispatch(updateFeed(feedData));
      return;
    }
    console.log('Failed when try to update link and feed data.');
  }), 10000);
  await callback(
    <Provider store={store}>
      <div>
        <Layout>{React.createElement(component)}</Layout>
        { __DEV__ && __CLIENT__ &&
          <DevTools />
        }
      </div>
    </Provider>
  );
};

function run() {
  const container = document.getElementById('app');
  Location.listen(location => {
    route(location.pathname, async (component) => ReactDOM.render(component, container, () => {
      // Track the page view event via Google Analytics
      window.ga('send', 'pageview');
    }));
  });
}

if (canUseDOM) {
  // Run the application when both DOM is ready and page content is loaded
  if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
    run();
  } else {
    document.addEventListener('DOMContentLoaded', run, false);
  }
}

export default { route, routes };
