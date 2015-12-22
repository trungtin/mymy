import React, {PropTypes} from 'react';
import {Cell, Grid, Textfield} from 'react-mdl';

const FeedView = (props) => {
  console.log(props.feedList);
  return <div></div>
};

FeedView.propTypes = {
  feedList: PropTypes.array,
};

export default FeedView;
