import React, {PropTypes} from 'react';
import LinkList from '../../../LinkList';
import {Cell, Grid, Textfield} from 'react-mdl';

const checkMark = (<div className="checkmark"></div>);

const LinkView = (props) => <Grid>
  <Cell col={9}>
    <h2>Hello</h2>
    { props.linkList && Object.keys(props.linkList).length &&
      <LinkList data={props.linkList}
        onSelect={props.selectLinkToAdd} selectedList={props.toBeAddedLinkList} selectable selectedMarker={checkMark}/>
    }
  </Cell>
  <Cell col={3}>
    <Textfield floatingLabel label="Filter" />
    <section>
      <h4>Custom Link</h4>
      <Textfield label="Name" />
      <Textfield label="Url" />
      <Textfield label="Icon" />
    </section>
  </Cell>
</Grid>;

LinkView.propTypes = {
  linkList: PropTypes.array,
  selectLinkToAdd: PropTypes.func,
  toBeAddedLinkList: PropTypes.array,
};

export default LinkView;
