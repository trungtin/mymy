import React, {PropTypes} from 'react';

const FeedsReadingModalContent = (props) => {
  return (
    <article>
      <h4>{props.title}</h4>
      <br/>

      <img src={props.mainImgSrc} alt=""/>
      <section dangerouslySetInnerHTML={{ __html: props.article}}>
      </section>
    </article>
    );
};

FeedsReadingModalContent.propTypes = {
  title: PropTypes.string.isRequired,
  mainImgSrc: PropTypes.string,
  article: PropTypes.string,
};

export default FeedsReadingModalContent;
