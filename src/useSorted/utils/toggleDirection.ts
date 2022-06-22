import { SortDirection } from '../useSorted.types';

const toggleDirection = (direction?: SortDirection) =>
  direction === SortDirection.ASCENDING ? SortDirection.DESCENDING : SortDirection.ASCENDING;

export default toggleDirection;
