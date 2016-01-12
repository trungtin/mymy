import React, {PropTypes} from 'react';
import LinkList from '../../../LinkList';
import {Cell, Grid, Textfield, Icon, Button, FABButton} from 'react-mdl';
import './LinkView.scss';

const checkMark = (<div className="checkmark"></div>);

const sortByCategory = (list) => {
  const sorted = Object.keys(list).reduce((prev, cur) => {
    const curObj = list[cur];
    if (curObj.category && !curObj.category.length) {
      if (!prev.Uncategorized) {
        prev.Uncategorized = {};
      }
      prev.Uncategorized[cur] = curObj;
    } else if (curObj.category) {
      curObj.category.forEach(cat => {
        if (!prev[cat]) {
          prev[cat] = {};
        }
        prev[cat][cur] = curObj;
      });
    }
    return prev;
  }, {});
  return sorted;
};

export default class LinkView extends React.Component {
  static propTypes = {
    linkList: PropTypes.array,
    selectLinkToAdd: PropTypes.func,
    toBeAddedLinkList: PropTypes.array,
    sortByCategory: PropTypes.bool,
    style: PropTypes.object,
  }

  constructor(props) {
    super();

    this.sorted = undefined;
    if (props.linkList && Object.keys(props.linkList).length && props.sortByCategory) {
      this.sorted = sortByCategory(props.linkList);
    }
    this.state = {
      expanded: new Set(this.sorted ? Object.keys(this.sorted) : []),
    };
  }

  render() {
    const isAllExpanded = !!this.sorted && Object.keys(this.sorted).length === this.state.expanded.size;
    return (<Grid style={this.props.style}>
      <Cell col={10} style={{margin: 0, height: '100%', overflow: 'auto'}}>
        { this.props.linkList && Object.keys(this.props.linkList).length && !this.props.sortByCategory &&
          <LinkList data={this.props.linkList}
            onSelect={this.props.selectLinkToAdd} selectedList={this.props.toBeAddedLinkList} selectable selectedMarker={checkMark}/>
        }
        {
          this.sorted &&
          <Button style={{position: 'absolute', right: '20%', margin: 15, zIndex: 2}} onClick={() => {
            isAllExpanded ? this.setState({expanded: new Set([])}) : this.setState({expanded: new Set(Object.keys(this.sorted))});
          }}>{ isAllExpanded ? 'Collapse all' : 'Expand all'}</Button>
        }
        {
          this.sorted &&
          <div>{Object.keys(this.sorted).map(category => {
            const catExpanded = this.state.expanded.has(category);
            return (
            <section style={{position: 'relative', minHeight: 48}}>
              <FABButton mini riple onClick={() =>{
                if (catExpanded) {
                  this.state.expanded.delete(category);
                  return this.setState({expanded: this.state.expanded});
                }
                return this.setState({expanded: this.state.expanded.add(category)});
              }} className={`link-view__expand-icon${catExpanded ? ' expanded' : ''}`}><Icon name="add"/></FABButton>
              <h5 className="link-view__category-title">{category}</h5>
              <div className="link-view__category-content">
                <LinkList data={this.sorted[category]}
                  onSelect={this.props.selectLinkToAdd} selectedList={this.props.toBeAddedLinkList} selectable selectedMarker={checkMark}/>
              </div>
            </section>
          );})}</div>
        }
      </Cell>
      <Cell col={2}>
        <Textfield floatingLabel label="Filter" />
        <section>
          <h5 style={{fontWeight: 300}}>Custom Link:</h5>
          <div style={{paddingLeft: '2rem'}}>
            <Textfield label="Name" />
            <Textfield label="Url" />
            <Textfield label="Icon" />
            <Button ripple raised accent onClick={(event) => {}}>Add</Button>
            <Button onClick={() => {}}>Clear</Button>
          </div>
        </section>
      </Cell>
    </Grid>);
  }
}
