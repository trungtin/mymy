import React from 'react';
import './WidgetResizer.scss';
import {connect} from 'react-redux';

import {editSize as _editSize} from '../../core/redux/modules/widget.js';

const WidgetResizer = (props) => {
  console.log('WR: ', props)
  const editSize = (sizeChange) => {
    props._editSize({target: props.widgetKey, data: sizeChange});
  };

  return (
  <div className="card__resizer">
    <div className="resizer__dot resizer__dot-top-1">
      <div className="resizer__droplet" onClick={() => {editSize(-2);}}></div>
    </div>
    <div className="resizer__dot resizer__dot-top-2">
      <div className="resizer__droplet" onClick={() => {editSize(-1);}}></div>
    </div>
    <div className="resizer__dot resizer__dot-top-3">
      <div className="resizer__droplet" onClick={() => {editSize(-1);}}></div>
      <div className="resizer__droplet" onClick={() => {editSize(+1);}}></div>
    </div>
    <div className="resizer__dot resizer__dot-left-1">
      <div className="resizer__droplet" onClick={() => {editSize(-20);}}></div>
    </div>
    <div className="resizer__dot resizer__dot-left-2">
      <div className="resizer__droplet" onClick={() => {editSize(-10);}}></div>
    </div>
    <div className="resizer__dot resizer__dot-left-3">
      <div className="resizer__droplet" onClick={() => {editSize(-10);}}></div>
      <div className="resizer__droplet" onClick={() => {editSize(+10);}}></div>
    </div>
  </div>
  );
};

export default connect(undefined, {_editSize})(WidgetResizer);
