/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import React from 'react';
import './Navigation.scss';
import Link from '../Link';
import {Header, HeaderRow, Navigation as NavigationMDL} from 'react-mdl'

function Navigation() {
  return (
    <Header>
      <HeaderRow title="Mymy">
        <NavigationMDL className="nav-link_list">
          <a href="/" onClick={Link.handleClick}>Home</a>
          <a href="/about" onClick={Link.handleClick}>About</a>
        </NavigationMDL>
      </HeaderRow>
    </Header>
  );
}

export default Navigation;
