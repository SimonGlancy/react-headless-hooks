export const push = <DataType>(array: DataType[], value: DataType) => [...array, value];
export const unshift = <DataType>(array: DataType[], value: DataType) => [value, ...array];

export const indexOf = <DataType>(array: DataType[], value: DataType) => array.indexOf(value);
export const inArray = <DataType>(array: DataType[], value: DataType) =>
  indexOf(array, value) !== -1;

export const del = <DataType>(array: DataType[], value: DataType, elements = 1) => {
  const index = indexOf(array, value);

  array.splice(index, elements);
  return [...array];
};

export const deleteByFilter = <DataType>(array: DataType[], index: number) =>
  array.filter((_, i) => i !== index);

export const toggleValue = <DataType>(array: DataType[], value: DataType) => {
  if (inArray(array, value)) {
    return del(array, value);
  }
  return push(array, value);
};
