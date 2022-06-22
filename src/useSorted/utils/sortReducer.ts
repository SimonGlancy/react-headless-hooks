import { GenericObject } from '../../types';
import {
  SortActions,
  SortDirection,
  SortState,
  SortStateType,
} from '../useSorted.types';
import toggleDirection from './toggleDirection';
import toggleSortKey from './toggleSortKey';

const sortReducer = <DataType extends GenericObject>(
  state: SortState<DataType>,
  action: SortActions<DataType>
): SortState<DataType> => {
  const { type, payload } = action;
  switch (type) {
    case SortStateType.SET_SORT_KEY:
      return {
        direction: SortDirection.DESCENDING,
        sortKey: payload,
      };
    case SortStateType.TOGGLE_DIRECTION:
      return {
        ...state,
        direction: toggleDirection(state?.direction),
      };
    case SortStateType.SET_DIRECTION:
      return {
        ...state,
        direction: payload,
      };
    case SortStateType.TOGGLE_SORT_KEY:
      return {
        direction: toggleSortKey(payload, state?.sortKey)
          ? SortDirection.DESCENDING
          : toggleDirection(state?.direction),
        sortKey: payload,
      };
    default:
      return state;
  }
};

export default sortReducer;
