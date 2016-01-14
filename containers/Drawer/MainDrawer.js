import React, {PropTypes} from 'react';
import './MainDrawer.scss';
import DrawerMenu from './DrawerMenu';
import { Textfield, Button, Spinner } from 'react-mdl';
import * as configurationAction from '../../core/redux/modules/configuration';
import { connect } from 'react-redux';
import request from 'superagent';
import {findDOMNode} from 'react-dom';

@connect(state => ({
  bg: state.configuration.background,
}))
class BackgroundFromUrl extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    bg: PropTypes.string,
  }

  constructor() {
    super();
    this.state = {
      setting: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bg !== this.props.bg) {
      this.setState({setting: false});
    }
  }

  errorHappen() {
    this.setState({setting: false});
    findDOMNode(this.refs.textfield).classList.add('is-invalid');
  }

  render() {
    return (<div style={{padding: '0 2rem', paddingBottom: '1rem', borderBottom: '1px solid rgb(187, 187, 187)'}}>
      <Textfield id="background-from-url__input" label="Url..."
        pattern="-?.*?"
        error="Error Happen!"
        style={{width: 'initial', marginTop: '-2rem'}} ref="textfield"/>
      <section>
        <Button raised accent onClick={() => {
          if (this.state.setting === true) {
            return;
          }
          this.setState({setting: true});
          const inputValue = document.getElementById('background-from-url__input').value;
          if (inputValue && inputValue.length) {
            const originalXHR = request.getXHR;
            request.getXHR = () => {
              const xhr = originalXHR();
              xhr.responseType = 'blob';
              return xhr;
            };
            request
              .get(inputValue)
              .set('Accept', 'image/*')
              .end((err, res) => {
                if (err) return this.errorHappen();
                if (res.type.startsWith('image')) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    this.props.dispatch(configurationAction.setBackground(reader.result));
                  };
                  reader.readAsDataURL(res.xhr.response);
                } else {
                  return this.errorHappen();
                }
              });
            request.getXHR = originalXHR;
          }
        }}>{this.state.setting && <Spinner /> || 'Set'}</Button>
        <Button onClick={() => this.props.close()}>Cancel</Button>
      </section>
    </div>);
  }
}

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
          ], [
            'Clear Background',
            'pink',
            (dispatch) => {
              dispatch(configurationAction.setBackground(null));
            },
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
    <div style={{height: '100%'}}>
      <div className="drawer-content">
        <div className="drawer-header">
          <img src="https://placeholdit.imgix.net/~text?txtsize=33&txt=150%C3%97150&w=150&h=150" alt="Profile"/>
          <h5>Profile name</h5>
        </div>
        <DrawerMenu menuItem={menuStructure}/>
      </div>
    </div>
    );
};

MainDrawer.propTypes = {
  layer: PropTypes.number,
};

export default MainDrawer;
