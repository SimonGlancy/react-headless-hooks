import { FilterType } from '../useFilter.types';

type ObjectWithValue<ValueType> = {
  value: ValueType;
};

const updateInArrayStateType = <ValueType, DataType extends ObjectWithValue<ValueType>>(
  prev: DataType[],
  index: number,
  value: FilterType
) =>
  prev.map((filter, i) => {
    if (i === index) {
      return {
        ...filter,
        type: value,
      };
    }

    return filter;
  });

export default updateInArrayStateType;
