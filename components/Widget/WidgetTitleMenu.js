import React, {PropTypes} from 'react';
import {Menu, MenuItem, IconButton, Icon, CardTitle, FABButton, Tabs, Tab} from 'react-mdl';
import EditableTagName from '../EditableTagName';
import './WidgetTitleMenu.scss';

let curId = 1;

const WidgetTitleMenu = (props) => {
  return (
    <CardTitle style={{justifyContent: 'space-between', padding: '0px 16px'}}>
      <Tabs ripple activeTab={0} onChange={props.onTabChange}>
        { props.tabs && props.tabs.map((tab, index) => <Tab key={`tab-${index}`}>{tab}</Tab>)}
      </Tabs>
      <div>
        <IconButton id={'widget-title-menu-' + curId} name="more_vert" ripple/>
        <Menu target={'widget-title-menu-' + curId++} ripple align="right" valign="bottom">
          <li className="mdl-menu__special-item">
            <FABButton mini colored raised ripple onClick={(event) => props.openModal(event, 1)}>
              <Icon name="add_to_photos" ripple/>
            </FABButton>
            <FABButton mini colored raised ripple>B</FABButton>
            <FABButton mini raised ripple>C</FABButton>
            <FABButton mini primary raised ripple>D</FABButton>
            <FABButton mini>D</FABButton>
          </li>
          <MenuItem>Lorem</MenuItem>
          <MenuItem>Ipsum</MenuItem>
        </Menu>
      </div>
    </CardTitle>
    );
};

WidgetTitleMenu.propTypes = {
  tabs: PropTypes.array,
  onTabChange: PropTypes.func,
  openModal: PropTypes.func,
};

export default WidgetTitleMenu;
