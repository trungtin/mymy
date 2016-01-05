const requestNext = (array, curIndex) => {
  if (!Array.isArray(array) || !~curIndex || curIndex >= array.length - 1) {
    return false;
  }
  return array[curIndex + 1];
};

export default {requestNext};
