import React, {PropTypes} from 'react';
import LinkView from './components/LinkView';
import {Button} from 'react-mdl';

const AddLinkModalContent = (props) => <div>
  <LinkView linkList={props.linkList} selectLinkToAdd={props.selectLinkToAdd} toBeAddedLinkList={props.toBeAddedLinkList} />
  <div className="modal-footer">
    <Button raised colored onClick={(event) => props.addLinkToWidget(event)}>Save</Button>
    <Button onClick={props.closeModal}>Cancel</Button>
  </div>
</div>;

AddLinkModalContent.propTypes = {
  linkList: PropTypes.array,
  selectLinkToAdd: PropTypes.func,
  addLinkToWidget: PropTypes.func,
  closeModal: PropTypes.func,
  toBeAddedLinkList: PropTypes.array,
};

export default AddLinkModalContent;
