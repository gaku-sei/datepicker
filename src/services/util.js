'use strict';

export const capitalize = (str) =>
  str[0].toUpperCase() + str.slice(1);

export const partition = (xs, length) => {
  const ret = [];
  xs.forEach((x, i) => {
    if (i % length === 0) {
      ret.push([x]);
    } else {
      ret[ret.length - 1].push(x);
    }
  });
  return ret;
};

export const repeat = (x, n) => {
  const ret = [];
  for (let i = 0; i < n; i++) {
    ret.push(x);
  }
  return ret;
};
