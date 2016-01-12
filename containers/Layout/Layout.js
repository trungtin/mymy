import React, { PropTypes } from 'react';
import './Layout.scss';
import Navigation from '../Navigation';
import {Layout as LayoutMDL, Drawer} from 'react-mdl';
import MainDrawer from '../Drawer/MainDrawer';

function Layout({ children }) {
  return (
    <LayoutMDL>
      <div className="mdl-layout__inner-container">
        <Navigation />
        <Drawer><MainDrawer /></Drawer>
        {children}
      </div>
    </LayoutMDL>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Layout;
