import { GenericObject, Paths } from '../../types';
import { Filter } from '../useFilter.types';
import { toggleValue } from './arrayUtils';

const toggleFilterKeys = <DataType extends GenericObject>(
  prev: Filter<DataType>[],
  index: number,
  filterKey: Paths<DataType>
) =>
  prev.map((filter, i) => {
    if (i === index) {
      const keys = toggleValue(filter.keys, filterKey);

      return {
        ...filter,
        keys,
      };
    }
    return filter;
  });

export default toggleFilterKeys;
