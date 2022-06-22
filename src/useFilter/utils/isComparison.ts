import { FilterType } from '../useFilter.types';

const isComparison = (type: FilterType) =>
  type === FilterType.MORE_THAN ||
  type === FilterType.LESS_THAN ||
  type === FilterType.MORE_THAN_OR_EQUAL ||
  type === FilterType.LESS_THAN_OR_EQUAL ||
  type === FilterType.EQUAL;

export default isComparison;
