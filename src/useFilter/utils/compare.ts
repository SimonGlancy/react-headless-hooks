import { GenericObject } from '../../types';
import { FilterType, Filter } from '../useFilter.types';
import getValues from './getValues';

export const comparison = (
  a: number | string,
  b: number | string,
  type?: FilterType
) => {
  switch (type) {
    case FilterType.MORE_THAN:
      return a > b;
    case FilterType.LESS_THAN:
      return a < b;
    case FilterType.MORE_THAN_OR_EQUAL:
      return a >= b;
    case FilterType.LESS_THAN_OR_EQUAL:
      return a <= b;
    case FilterType.EQUAL:
      return a === b;
    default:
      return a === b;
  }
};

const compare = <DataType extends GenericObject>(
  data: DataType[],
  keys: Filter<DataType>['keys'],
  value: string | number,
  type: FilterType
) => {
  const valueAsNum = type === FilterType.EQUAL ? value : Number(value);
  return data.filter((item) => {
    const values = getValues(item, keys);

    return !!values.filter((val) => {
      const compValue = type === FilterType.EQUAL ? val : Number(val);
      return comparison(compValue, valueAsNum, type);
    }).length;
  });
};

export default compare;
