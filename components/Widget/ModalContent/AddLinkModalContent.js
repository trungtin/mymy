import React, {PropTypes} from 'react';
import LinkView from './components/LinkView';

const AddLinkModalContent = (props) => <div>
  <LinkView linkList={props.linkList} selectLinkToAdd={props.selectLinkToAdd} toBeAddedLinkList={props.toBeAddedLinkList} />
  <button onClick={props.addLinkToWidget}>Save</button>
  <button onClick={props.closeModal}>close</button>
</div>;

AddLinkModalContent.propTypes = {
  linkList: PropTypes.array,
  selectLinkToAdd: PropTypes.func,
  addLinkToWidget: PropTypes.func,
  closeModal: PropTypes.func,
  toBeAddedLinkList: PropTypes.array,
};

export default AddLinkModalContent;
