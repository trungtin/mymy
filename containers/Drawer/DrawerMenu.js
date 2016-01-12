import React, {PropTypes} from 'react';
import './DrawerMenu.scss';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

function replaceArrayItem(array, index, item) {
  return [
    ...array.slice(0, index),
    item,
    ...array.slice(index + 1),
  ];
}

export default class DrawerMenu extends React.Component {
  static propTypes = {
    layer: PropTypes.number,
    color: PropTypes.string,
    menuItem: PropTypes.array.isRequired,
    closeYourself: PropTypes.func,
    title: PropTypes.string,
  }

  constructor() {
    super();
    this.state = {
      nextMenu: null,
      menuItemSupplyElement: [],
    };
  }

  toggleMenuItemSupplyElement(item, index) {
    this.setState({
      menuItemSupplyElement: replaceArrayItem(
        this.state.menuItemSupplyElement,
        index,
        !this.state.menuItemSupplyElement[index] ? item : null
        ),
    });
  }

  closeNextMenu() {
    this.setState({nextMenu: null});
  }

  render() {
    const colored = this.props.color ? 'colored__' + this.props.color : undefined;
    const menuClassName = classNames({[colored]: !!colored, 'drawer-menu': true});
    return (
      <div className={'drawer-menu__wrapper' + (!this.props.layer ? ' outmost-menu' : '')}>
        { this.props.layer > 0 &&
          <div className="drawer-layer__pusher" onClick={this.props.closeYourself}></div>
        }
        <div className={menuClassName}
          style={this.props.layer > 0 && {width: 'calc(100% - ' + this.props.layer * 4 + 'px)'} || {width: '100%'}}
        >
          <h5 className="drawer-menu__title">{this.props.title}</h5>
          <ul>
            { this.props.menuItem.map((item, index) =>
              Array.isArray(item) ?
                <li className="drawer-menu__item-wrapper">
                  <button className={'drawer-menu__item colored__' + item[1]}
                    onClick={() =>
                      item[2] && ( item[2].type === this.constructor ? this.setState({nextMenu:
                        React.cloneElement(item[2], {closeYourself: ::this.closeNextMenu,
                          color: item[1],
                          title: `${!!this.props.title && (this.props.title + ' ~ ') || ''}${item[0]}`,
                          layer: (this.props.layer || 0) + 1,
                        }),
                      }) : this.toggleMenuItemSupplyElement(React.cloneElement(item[2], {
                        close: () => this.toggleMenuItemSupplyElement(null, index),
                      }), index)
                    )}>
                  <h6 style={{margin: 0}}>{item[0]}</h6></button>{ this.state.menuItemSupplyElement[index] }
                </li> :
              (!!item &&
                <li className="drawer-menu__item"><h6 style={{margin: 0}}>{item}</h6></li>
              ))
            }
          </ul>
          <ReactCSSTransitionGroup
            transitionName="drawer-menu__wrapper"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
          >
            { this.state.nextMenu }
          </ReactCSSTransitionGroup>
        </div>
      </div>
      );
  }
}
