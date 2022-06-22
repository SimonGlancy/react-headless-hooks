import { SelectedObject } from '../useSelected.types';

const getNewSelectedIndexes = <DataType>(
  previousData: DataType[],
  currentData: DataType[],
  selected: SelectedObject
) => {
  const previousSelected = Object.keys(selected).map((key) => previousData[+key]);
  // turn the current data into an object where the key is a stringified version of the object
  // and the value is index
  const invertedData = currentData.reduce<Record<string, number>>((acc, curr, index) => {
    const stringifiedObj = JSON.stringify(curr);
    return { ...acc, [stringifiedObj]: index };
  }, {});

  // map the previous selected array and use the stringified version of the obj to access the current
  // index of the invertedData
  const newSelected = previousSelected.reduce((acc, curr) => {
    const stringifiedObj = JSON.stringify(curr);
    const newIndex = invertedData[stringifiedObj];
    return {
      ...acc,
      [newIndex]: true,
    };
  }, {});

  return newSelected;
};

export default getNewSelectedIndexes;
