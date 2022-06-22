import { GenericObject } from '../../types';
import { Filter } from '../useFilter.types';
import getValues from './getValues';

const includes = <DataType extends GenericObject>(
  data: DataType[],
  keys: Filter<DataType>['keys'],
  value: Filter<DataType>['value']
) =>
  data.filter((item) => {
    const values = getValues(item, keys);
    return !!values.filter((val) =>
      String(val).toLocaleLowerCase().includes(value.toString().toLowerCase())
    ).length;
  });

export default includes;
