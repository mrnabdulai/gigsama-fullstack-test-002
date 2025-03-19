import lodash from "lodash";
import { IDataMap } from "./query";
import { isValidObjectId } from "mongoose"

export const flattenObj = (
  obj: IDataMap,
  parent?: string,
  res: IDataMap = {}
): IDataMap => {
  for (let key in obj) {
    let propName = parent ? parent + "." + key : key;
    if (isValidObjectId(obj[key])) {
      res[propName] = obj[key].toString();
    }
    else if (typeof obj[key] == "object") {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
};

export const unflattenObj = (obj: IDataMap): IDataMap => {
  let res: IDataMap = {};
  for (var i in obj) {
    let keys = i?.split(".");
    keys.reduce(function (r, e, j) {
      return (
        r[e] ||
        (r[e] = isNaN(Number(keys[j + 1]))
          ? keys.length - 1 == j
            ? obj[i]
            : {}
          : [])
      );
    }, res);
  }
  return res;
};

export const isObject = (item: any): boolean => {
  return item && typeof item === "object" && !Array.isArray(item);
};

export const mergeObj = (
  target: IDataMap = {},
  ...sources: IDataMap[]
): IDataMap => {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (let key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          target[key] = source[key];
        } else {
          target[key] = mergeObj(target[key], source[key]);
        }
      } else {
        target[key] = lodash.uniq([source[key], target[key]]).join(" ").trim();
      }
    }
  }
  return mergeObj(target, ...sources);
};


export const objectDifference = (prev: object, next: object) => {
  interface IResult {
    [key: string]: [any, any]
  }
  const result: IResult = {};
  const sameKeys = Object.keys(prev).filter(key => next.hasOwnProperty(key));
  for (const key of sameKeys) {
    if (!lodash.isEqual(prev[key], next[key])) {
      result[key] = [prev[key], next[key]];
    }
  }

  return result
}

