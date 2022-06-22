import { FilterValue } from '../useFilter.types';

const isArrayValue = (value: FilterValue): value is [number, number] => {
  return Array.isArray(value);
};

export default isArrayValue;
