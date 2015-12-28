import React, {PropTypes} from 'react';
import './Tooltip.scss';

export default class Tooltip extends React.Component {
  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    position: PropTypes.string,
    hidden: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    tooltipStyle: PropTypes.object,
    tooltipClassName: PropTypes.string,
    color: PropTypes.string,
    toggleOnClick: PropTypes.bool,
    onClick: PropTypes.func,
    noTriangle: PropTypes.bool,
    style: PropTypes.object,
  }

  constructor(props) {
    super();
    this.state = {
      showing: !props.toggleOnClick,
    };
  }

  toggleShowing() {
    this.setState({showing: !this.state.showing});
  }

  render() {
    const {content, tooltipStyle, tooltipClassName, position, children, color, hidden, onClick, style, ...rest} = this.props;
    const trianglePosition = {};
    let triangleRotation;
    const _position = position && position.split('') || ['n', 'e'];
    trianglePosition.top = (_position[0] === 's' && '100%') || (~['w', 'e'].indexOf(_position[0]) && '50%') || undefined;
    trianglePosition.left = (_position[0] === 'e' && '100%') || (_position[1] === 'e' && '33%') || (_position[1] === 'w' && '67%') || (~['n', 's'].indexOf(_position[0]) && '50%') || undefined;
    trianglePosition.right = (_position[0] === 'w' && '100%') || undefined;
    trianglePosition.bottom = (_position[0] === 'n' && '100%') || undefined;
    triangleRotation = (_position[0] === 'n' && '270deg') || (_position[0] === 'w' && '180deg') || (_position[0] === 's' && '90deg') || (_position[0] === 'e' && '0deg');

    const tooltipPosition = {};
    tooltipPosition.top = (_position[0] === 's' && 'calc(100% + 7px)') || undefined;
    tooltipPosition.bottom = (_position[0] === 'n' && 'calc(100% + 7px)') || undefined;
    tooltipPosition.left = (_position[0] === 'e' && 'calc(100% + 7px)') || (_position[1] === 'w' && '25%') || (_position[1] === 'e' && '75%') || '50%';
    tooltipPosition.right = (_position[0] === 'w' && 'calc(100% + 7px)') || undefined;

    const defaultTooltipStyle = {
      position: 'absolute',
      ...tooltipPosition,
      width: 200,
      padding: '5px 8px',
      borderRadius: '3px',
      boxShadow: '1px 1px 3px rgba(0,0,0,0.3)',
      color: 'white',
      backgroundColor: color || '#3F51B5',
      transform: 'translateX(-50%)',
      transition: 'all 0.5s ease-in-out',
      zIndex: 5,
    };

    const triangleStyle = {
      position: 'absolute',
      ...trianglePosition,
      transformOrigin: 'center right',
      transform: `rotate(${triangleRotation})`,
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
      borderRight: `8px solid ${color || '#3F51B5'}`,
      borderLeft: 'none',
      transition: 'all 0.5s ease-in-out',
      zIndex: 5,
    };

    const _tooltipStyle = {...defaultTooltipStyle, ...tooltipStyle};
    return (<div {...rest} style={{position: 'relative', ...style}}>
      <div onClick={() => {this.props.toggleOnClick && ::this.toggleShowing(); this.props.onClick && onClick();}}>
        {children}
      </div>
      { content && !hidden && this.state.showing &&
        <div>
          { !this.props.noTriangle &&
            <div style={triangleStyle}></div>
          }
          <div className={`material__tooltip${this.props.tooltipClassName ? ' ' + this.props.tooltipClassName : ''}`} style={_tooltipStyle}>
            {content}
          </div>
        </div>
      }
    </div>);
  }
}
