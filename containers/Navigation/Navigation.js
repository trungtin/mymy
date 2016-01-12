import React from 'react';
import './Navigation.scss';
import Link from '../Link';
import {Header, HeaderRow, Navigation as NavigationMDL} from 'react-mdl'

function Navigation() {
  return (
    <Header scroll transparent style={{position: 'relative'}}>
      <div className="main-logo"></div>
      <nav className="nav-link_list--left">

      </nav>
      <nav className="nav-link_list--right">

      </nav>
    </Header>
  );
}

export default Navigation;
