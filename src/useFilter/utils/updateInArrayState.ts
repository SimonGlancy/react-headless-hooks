type ObjectWithValue<ValueType> = {
  value: ValueType;
};

const updateInArrayState = <ValueType, DataType extends ObjectWithValue<ValueType>>(
  prev: DataType[],
  index: number,
  value: ValueType
) =>
  prev.map((filter, i) => {
    if (i === index) {
      return {
        ...filter,
        value,
      };
    }

    return filter;
  });

export default updateInArrayState;
