import React, {PropTypes} from 'react';

const preProcess = (data) => {
  if (typeof data !== 'object') {
    throw Error('Data of LinkList must be an object or array');
  }
  return Array.isArray(data) ? data : Object.keys(data).filter(key => data[key].hasOwnProperty('url'));
};

const LinkList = (props) => <div style={{display: 'inline'}}>{preProcess(props.data).map((con, index) => con && (
  <div key={`link-${index}`} style={{position: 'relative', display: 'inline-block', margin: 8, width: 48, height: 48}} onClick={event => {
    if (!props.onSelect) {
      return;
    }
    event.preventDefault();
    props.onSelect(event, con);
  }}>
    <a href={con.url || props.data[con].url}>
      <img src={con.icon || (props.data[con] && props.data[con].icon) || 'https://' + (con.url || props.data[con].url).match(/\/\/([a-z0-9\.]+)/i)[1] + '/apple-touch-icon.png'} style={{width: 48, height: 48}} alt={con.name || con}/>
      {
        props.selectable && !!~props.selectedList.indexOf(con) &&
        props.selectedMarker
      }
    </a>
  </div>
))}</div>;

LinkList.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onSelect: PropTypes.func,
  selectable: PropTypes.bool,
  selectedList: PropTypes.array,
  selectedMarker: PropTypes.element,
};

export default LinkList;
