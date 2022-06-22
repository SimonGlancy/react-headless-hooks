import { Paths } from '../../types';
import { getValue } from '../../useFilter/utils';
import { SortDirection } from '../useSorted.types';

const getComparisonValues = <DataType>(
  a: DataType,
  b: DataType,
  sortKey?: Paths<DataType>,
  direction?: SortDirection
) => {
  if (!sortKey) {
    return direction === SortDirection.ASCENDING ? [a, b] : [b, a];
  }
  if (direction === SortDirection.ASCENDING) {
    return [getValue(a, sortKey), getValue(b, sortKey)];
  }
  return [getValue(b, sortKey), getValue(a, sortKey)];
};

export default getComparisonValues;
