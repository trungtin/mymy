// Not done

import React, {Component, PropTypes} from 'react';
import {Textfield} from 'react-mdl';

export default class EditableTagName extends Component {
  static propTypes = {
    name: PropTypes.string,
    editing: PropTypes.bool,
    editedCallback: PropTypes.func,
  }

  render() {
    return (
      <div>
        { !this.props.editing &&
          <span>{this.props.name}</span>
        }
        { this.props.editing &&
          <Textfield label="" value={this.props.name} onChange={(ev) => console.log(ev)} onClick={(event) => event.stopPropagation()}/>
        }
      </div>
    );
  }
}

