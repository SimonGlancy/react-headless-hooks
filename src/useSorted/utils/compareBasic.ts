const compareBasic = <DataType>(a: DataType, b: DataType) => {
  return a === b ? 0 : a > b ? 1 : -1;
};

export default compareBasic;
