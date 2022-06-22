import { GenericObject } from '../../types';
import { Filter, FilterType } from '../useFilter.types';
import { comparison } from './compare';
import getValues from './getValues';

const evaluateRange = (
  range: [number, number],
  value: number,
  type: FilterType.OUTSIDE_RANGE | FilterType.WITHIN_RANGE
) => {
  switch (type) {
    case FilterType.WITHIN_RANGE:
      return (
        comparison(value, range[0], FilterType.MORE_THAN_OR_EQUAL) &&
        comparison(value, range[1], FilterType.LESS_THAN_OR_EQUAL)
      );
    case FilterType.OUTSIDE_RANGE:
      return (
        comparison(value, range[0], FilterType.LESS_THAN) ||
        comparison(value, range[1], FilterType.MORE_THAN)
      );
  }
};

const checkRange = <DataType extends GenericObject>(
  data: DataType[],
  keys: Filter<DataType>['keys'],
  value: [number, number],
  type: FilterType.OUTSIDE_RANGE | FilterType.WITHIN_RANGE
) => {
  return data.filter((item) => {
    const values = getValues(item, keys);

    return !!values.filter((val) => evaluateRange(value, val, type)).length;
  });
};

export default checkRange;
