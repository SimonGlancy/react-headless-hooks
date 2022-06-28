export { default as useDataCopy } from './useDataCopy';
export { default as usePrevious } from './usePrevious';
export type { GenericObject, Paths } from './types';

export type {
  UseSelectedProps,
  UseSelectedReturnValues,
  SelectedObject,
  SelectFunction,
} from './useSelected';
export {
  default as useSelected,
  SelectTypeEnum,
  normaliseData,
  getNewSelectedIndexes,
} from './useSelected';

export {
  default as useSorted,
  SortDirection,
  sortReducer,
  toggleDirection,
  toggleSortKey,
  compareBasic,
  getComparisonValues,
  dateTime,
  toString,
  alphaNumeric,
} from './useSorted';
export type { UseSortedProps } from './useSorted';

export {
  default as useFilter,
  FilterType,
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
} from './useFilter';

export type {
  UseFilterProps,
  UseFilterReturn,
  FiltersStateObj,
  FilterExtended,
  Filter,
  FilterValue,
  RangeType,
} from './useFilter';

export { default as useStepper } from './useStepper';
export type { UseStepperProps, UseStepperReturn } from './useStepper';

export { default as usePagination, paginateData } from './usePagination';
export type { UsePaginationReturn, UsePaginationProps } from './usePagination';
