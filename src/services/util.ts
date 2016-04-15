'use strict';

export const capitalize = (str: string) =>
  str[0].toUpperCase() + str.slice(1);

export const partition = <T>(xs: Array<T>, length: number): Array<Array<T>> => {
  const ret: Array<Array<T>> = [];
  xs.forEach((x, i) => {
    if (i % length === 0) {
      ret.push([x]);
    } else {
      ret[ret.length - 1].push(x);
    }
  });
  return ret;
};

export const repeat = <T>(x: T, n: number): Array<T> => {
  const ret: Array<T> = [];
  for (let i = 0; i < n; i++) {
    ret.push(x);
  }
  return ret;
};
