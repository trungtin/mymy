import React, {PropTypes, Component} from 'react';
import {Textfield, Button} from 'react-mdl';
import {findDOMNode} from 'react-dom';

export default class ModalContentSidebar extends Component {
  static propTypes = {

  }
  componentDidMount() {
  }
  render() {
    return (
      <div style={{float: 'right', width: 'min-content', paddingRight: 24}}>
        <Textfield floatingLabel label="Filter"/>
        <section>
          <h5 style={{display: 'inline-block'}}>Custom Link</h5>
          <Button style={{float: 'right', marginTop: 16, padding: '8px 16px', height: '100%'}}><h5 style={{margin: 0}}>Add</h5></Button>
          <div>
            <div>
              <Textfield label="Name" ref="customNameInput" />
              <Textfield label="Url" ref="customUrlInput" />
              <Textfield label="Icon" ref="customIconInput" />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
