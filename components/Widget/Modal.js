import React, {PropTypes} from 'react';
import {default as ReactModal} from 'react-modal';
import './Modal.scss';

export default class Modal extends React.Component {
  static propTypes = {
    modalOpen: PropTypes.bool,
    closeModal: PropTypes.func,
    modalContent: PropTypes.object,
  }
  
  render() {
    return (
      <ReactModal isOpen={this.props.modalOpen} onRequestClose={this.props.closeModal}
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            zIndex: 100,
          },
          content: {
            display: 'flex',
            overflow: 'hidden',
            top: 30,
            bottom: 30,
            padding: '0 20px',
          },
        }}
      >
        { typeof this.props.modalContent === 'object' &&
          this.props.modalContent
        }
      </ReactModal>);
  }
}
