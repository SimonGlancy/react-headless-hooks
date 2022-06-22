import { useReducer, Reducer, useCallback, useMemo } from 'react';
import { GenericObject, Paths } from '../types';
import useDataCopy from '../useDataCopy/useDataCopy';

import useObjectPaths from '../useObjectPaths';
import {
  SortActions,
  SortDirection,
  SortState,
  SortStateType,
  UseSortedProps,
  UseSortedReturnProps,
} from './useSorted.types';
import {
  compareBasic,
  getComparisonValues,
  sortReducer,
  dateTime,
  alphaNumeric,
} from './utils';
import numeric from './utils/numeric';

const useSorted = <DataType extends GenericObject>(
  props: UseSortedProps<DataType>
): UseSortedReturnProps<DataType> => {
  const {
    data: initialData,
    initialSortDirection = SortDirection.DESCENDING,
    initialSortKey,
    keyLabels,
    sortTypes,
  } = props;
  const { data } = useDataCopy(initialData);
  const [state, dispatch] = useReducer<
    Reducer<SortState<DataType>, SortActions<DataType>>
  >(sortReducer, {
    direction: initialSortDirection,
    sortKey: initialSortKey,
  });

  const setSortKey = useCallback(
    (sortKey: Paths<DataType>) =>
      dispatch({ type: SortStateType.SET_SORT_KEY, payload: sortKey }),
    [dispatch]
  );

  const removeSortKey = useCallback(
    () => dispatch({ type: SortStateType.SET_SORT_KEY, payload: undefined }),
    [dispatch]
  );

  const toggleSortKey = useCallback(
    (sortKey: Paths<DataType>) =>
      dispatch({ type: SortStateType.TOGGLE_SORT_KEY, payload: sortKey }),
    [dispatch]
  );

  const setDirection = useCallback(
    (direction: SortDirection) =>
      dispatch({ type: SortStateType.SET_DIRECTION, payload: direction }),
    [dispatch]
  );

  const toggleDirection = useCallback(
    () =>
      dispatch({ type: SortStateType.TOGGLE_DIRECTION, payload: undefined }),
    [dispatch]
  );

  const sortKey = useMemo(() => state?.sortKey, [state?.sortKey]);
  const direction = useMemo(() => state?.direction, [state?.direction]);

  const sortedData = useMemo(() => {
    if (!sortKey) {
      return data;
    }
    return data.sort((valueA, valueB) => {
      const [a, b] = getComparisonValues(valueA, valueB, sortKey, direction);

      const sortType = sortKey && sortTypes?.[sortKey];

      if (typeof sortType === 'function') {
        return sortType(a, b);
      }

      if (sortType === 'datetime') {
        return dateTime(a as string, b as string);
      }

      if (sortType === 'alphanumeric') {
        return alphaNumeric(a as string, b as string);
      }

      if (sortType === 'numeric') {
        return numeric(a as string, b as string);
      }

      return compareBasic(a, b);
    });
  }, [data, sortKey, direction]);

  const objectPaths = useObjectPaths(data, keyLabels);

  return {
    setSortKey,
    removeSortKey,
    toggleSortKey,
    setDirection,
    toggleDirection,
    sortKey,
    direction,
    sortedData,
    objectPaths,
  };
};

export default useSorted;
