import { FilterType } from '../useFilter.types';

const isRange = (type: FilterType) =>
  type === FilterType.WITHIN_RANGE || type === FilterType.OUTSIDE_RANGE;

export default isRange;
