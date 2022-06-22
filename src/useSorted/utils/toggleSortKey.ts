import { Paths } from '../../types';

const toggleSortKey = <DataType>(
  sortKey?: Paths<DataType>,
  stateValue?: Paths<DataType>
) => {
  if (!stateValue) {
    return sortKey;
  }
  if (sortKey === stateValue) {
    return undefined;
  }
  return sortKey;
};

export default toggleSortKey;
