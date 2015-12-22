/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import React, { PropTypes } from 'react';
import './Layout.scss';
import Navigation from '../Navigation';
import {Layout as LayoutMDL} from 'react-mdl';

function Layout({ children }) {
  return (
    <LayoutMDL fixedHeader>
      <div className="mdl-layout__inner-container">
        <Navigation />
        {children}
      </div>
    </LayoutMDL>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Layout;
