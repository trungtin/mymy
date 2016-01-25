import React from 'react';
import Widget from '../Widget';
import {Cell, Grid} from 'react-mdl';

const maxRow = 3;
const maxCol = 4;

function distribute(widgets, thisArg) {
  const keys = Object.keys(widgets);
  return keys.map((widgetKey, index) => {
    const col = widgets[widgetKey].size % 10;
    const row = Math.floor(widgets[widgetKey].size / 10);
    return {
      el: (<Widget data={widgets[widgetKey].data} widgetKey={widgetKey} openModal={::thisArg.openModal} key={`widget-${index}`} size={[col, row]} hideTabbar={widgets[widgetKey].hideTabbar}/>),
      col, row,
    };
  });
}


function merge(data, depth, curMaxRow, curMaxCol, callerColValue = 0) {
  // only use in depth > 0;
  let done = false;
  let sumCurRow = 0;

  let curMergeSkip = 0;
  let totalMergeSkip = 0;

  const result = data.reduce((prev, cur, curIndex, arr) => {
    // skipping merged element from last merge call.
    if (curMergeSkip > 0) {
      curMergeSkip--;
      return prev;
    }

    // total row in this block, for checking if total row has pass number of row of the left block
    sumCurRow += cur.row;

    if (depth > 0 && (done || sumCurRow > curMaxRow)) {
      return prev;
    }

    // main widget element.
    const curEl = <Cell col={cur.col * 12 / curMaxCol} key={`cell__${depth}-${curIndex}`} data-inner-cell>{cur.el}</Cell>;

    if (cur.col <= curMaxCol) {
      const mergedEl = cur.col === curMaxCol ? [{}, 0] : merge(arr.slice(curIndex + 1), depth + 1, cur.row, curMaxCol - cur.col, cur.col * 12 / curMaxCol);

      // curMergeSkip for skipping iteration count, totalMergeSkip for return to caller.
      curMergeSkip = mergedEl[1];
      totalMergeSkip += mergedEl[1] + 1;

      if (curMergeSkip > 0) {
        return prev.concat(<Grid className={`grid__${cur.row}x`} key={`grid__${depth}-${prev.length || 0}`}>{[curEl, mergedEl[0]]}</Grid>);
      } else {
        return prev.concat(<Grid className={`grid__${cur.row}x`} key={`grid__${depth}-${prev.length || 0}`}>{curEl}</Grid>);
      }
    } else if (depth > 0 && cur.col > curMaxCol) {
      done = true;
      return prev;
    }
    return prev; // skip when cur.col > curMaxCol && depth === 0.
  }, []);

  return [(<Cell col={12 - callerColValue} key={`cell__${depth}`}>{result}</Cell>), totalMergeSkip];
}

export default (data, thisArg) => merge(distribute(data, thisArg), 0, maxRow, maxCol)[0];
