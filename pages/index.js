/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import React, { Component } from 'react';
import {Textfield, Content, Button, Grid} from 'react-mdl';
import {WidgetContainer} from '../components';
import './styles/index.scss';

export default class extends Component {
  constructor() {
    super();
    this.state = {
      editLayout: false,
      extendedWidth: null,
    };
  }

  editLayout() {
    this.setState({editLayout: !this.state.editLayout});
  }

  render() {
    return (
      <Content style={{position: 'relative'}}>
        <section className="main-content" style={{width: this.state.extendedWidth}}>
          <Grid className="control-block">
            <Textfield floatingLabel label="Filter..." />
            <Button ripple onClick={::this.editLayout}>{this.state.editLayout ? 'Done' : 'Edit Layout'}</Button>
          </Grid>
          <WidgetContainer editLayout={this.state.editLayout}/>
        </section>
        { typeof window !== 'undefined' && window.innerWidth > 1200 &&
          <i className="material-icons zoom-out-icons" onClick={() => {
            const allowedWidth = window.innerWidth > 1600 ? ['80%', '100%'] : ['100%'];
            this.setState({extendedWidth: allowedWidth[allowedWidth.indexOf(this.state.extendedWidth) + 1]});
          }}>settings_ethernet</i>
        }
      </Content>
    );
  }

}
