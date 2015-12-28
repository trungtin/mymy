import React from 'react';
import Widget from '../Widget';
import {Cell, Grid} from 'react-mdl';

const maxRow = 3;
const maxCol = 4;

function distribute(widgets, thisArg) {
  const keys = Object.keys(widgets);
  return keys.map((widgetKey, index) => {
    return {
      el: (<Widget data={widgets[widgetKey].data} editLayout={thisArg.props.editLayout} widgetKey={widgetKey} openModal={::thisArg.openModal} key={`widget-${index}`}/>),
      col: widgets[widgetKey].size % 10,
      row: Math.floor(widgets[widgetKey].size / 10)};
  });
}


function merge(data, depth, curMaxRow, curMaxCol) {
  // only use in depth > 0;
  let done = false;
  let sumCurRow = 0;

  let curMergeSkip = 0;
  let totalMergeSkip = 0;

  const result = data.reduce((prev, cur, curIndex, arr) => {
    sumCurRow += cur.row;

    if (curMergeSkip > 0) {
      curMergeSkip--;
      return prev;
    }

    if (depth > 0 && (done || sumCurRow > curMaxRow)) {
      return prev;
    }


    const curEl = <Cell col={cur.col * 12 / curMaxCol} key={`cell__${depth}-${curIndex}`}>{cur.el}</Cell>;

    if (cur.col <= curMaxCol) {
      const mergedEl = merge(arr.slice(curIndex + 1), depth + 1, cur.row, curMaxCol - cur.col);
      curMergeSkip += mergedEl[1];
      totalMergeSkip += mergedEl[1];

      if (curMergeSkip > 0) {
        return prev.concat(<Grid className={`grid__${cur.row}x`} key={`grid__${depth}-${prev.length || 0}`}>{[curEl, mergedEl[0]]}</Grid>);
      } else {
        totalMergeSkip++;
        return depth > 0 ? prev.concat(<Grid className={`grid__${cur.row}x`} key={`grid__${depth}-${prev.length || 0}`}>{curEl}</Grid>) : prev.concat(curEl);
      }
    } else if (depth > 0 && cur.col > curMaxCol) {
      done = true;
      return prev;
    } else {
      totalMergeSkip++;
      return depth > 0 ? prev.concat(<Grid className={`grid__${cur.row}x`} key={`grid__${depth}-${prev.length || 0}`}>{curEl}</Grid>) : prev.concat(curEl);
    }
  }, []);

  return [(<Cell col={curMaxCol * 12 / maxCol} key={`cell__${depth}`}>{result}</Cell>), totalMergeSkip];
}

export default (data, thisArg) => merge(distribute(data, thisArg), 0, maxRow, maxCol)[0];
