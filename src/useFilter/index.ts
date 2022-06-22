export { default } from './useFilter';
export { FilterType } from './useFilter.types';
export type {
  UseFilterProps,
  UseFilterReturn,
  FiltersStateObj,
  FilterExtended,
  Filter,
  FilterValue,
  RangeType,
} from './useFilter.types';

export {
  includes,
  excludes,
  getValues,
  getValue,
  compare,
  checkRange,
  isArrayValue,
  isComparison,
  isRange,
  updateInArrayState,
  toggleFilterKeys,
  getObjectPaths,
  coerceValueToNumber,
} from './utils';
