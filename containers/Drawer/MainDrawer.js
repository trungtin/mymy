import React, {PropTypes} from 'react';
import './MainDrawer.scss';
import DrawerMenu from './DrawerMenu';
import { Textfield, Button } from 'react-mdl';

const BackgroundFromUrl = (props) => {
  return (<div style={{padding: '0 2rem'}}>
    <Textfield label="Url..." style={{width: 'initial'}}/>
    <section>
      <Button raised accent>Set</Button>
      <Button raised colored>Preview</Button>
      <Button onClick={() => props.close()}>Cancel</Button>
    </section>
  </div>);
};

const menuStructure = [
  [
    'Settings',
    'red',
    <DrawerMenu menuItem={[
      [
        'Change Wallpaper',
        'lime',
        <DrawerMenu menuItem={[
          [
            'Url',
            'red',
            <BackgroundFromUrl />,
          ], [
            'Reddit',
            'green',
          ], [
            'Upload image',
            'blue',
          ],
        ]}/>,
      ],
      [
        'Something',
        'green',
      ],
    ]}/>,
  ], [
    'Data',
    'lime',
    <DrawerMenu menuItem={[
      [
        'Export',
        'blue',
      ], [
        'Import',
        'pink',
        <DrawerMenu menuItem={[
          [
            'Url',
            'lime',
          ], [
            'Txt',
            'green',
          ],
        ]}/>,
      ],
    ]}/>,
  ], [
    'Test',
    'blue',
    <DrawerMenu menuItem={[
      'Hello',
      [
        'World',
        'red',
      ],
    ]}/>,
  ],
];

const MainDrawer = () => {
  return (
    <div>
      <div className="drawer-content">
        <div className="drawer-header"></div>
        <DrawerMenu menuItem={menuStructure}/>
      </div>
    </div>
    );
};

MainDrawer.propTypes = {
  layer: PropTypes.number,
};

export default MainDrawer;
