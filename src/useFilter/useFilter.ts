import { useCallback, useMemo, useState } from 'react';
import { GenericObject, Paths } from '../types';
import useDataCopy from '../useDataCopy/useDataCopy';
import useObjectPaths from '../useObjectPaths';
import {
  UseFilterProps,
  Filter,
  FilterType,
  FilterValue,
  RangeType,
  FilterExtended,
  FiltersStateObj,
  UseFilterReturn,
} from './useFilter.types';
import {
  checkRange,
  coerceValueToNumber,
  compare,
  excludes,
  includes,
  isArrayValue,
  isComparison,
  isRange,
  toggleFilterKeys,
  updateInArrayState,
} from './utils';
import updateInArrayStateType from './utils/updateInArrayStateType';

const useFilter = <DataType extends GenericObject>(
  props: UseFilterProps<DataType>
): UseFilterReturn<DataType> => {
  const { data: initialData, filters: filtersArray, keyLabels } = props;

  const { data } = useDataCopy(initialData);

  const [filters, setFilters] = useState<Filter<DataType>[]>(filtersArray);

  const filteredData = useMemo(() => {
    return filters.reduce<DataType[]>((acc, filter) => {
      //if the filter has no keys return all the data
      if (!filter.keys.length) {
        return acc;
      }
      if (filter.type === FilterType.INCLUDES) {
        return includes(acc, filter.keys, filter.value);
      }

      if (filter.type === FilterType.EXCLUDES) {
        return excludes(acc, filter.keys, filter.value);
      }

      if (isComparison(filter.type)) {
        if (Array.isArray(filter.value)) {
          return acc;
        }

        return compare(acc, filter.keys, filter.value, filter.type);
      }

      if (isRange(filter.type)) {
        if (!Array.isArray(filter.value)) {
          return acc;
        }

        return checkRange(
          acc,
          filter.keys,
          filter.value,
          filter.type as RangeType
        );
      }
      return acc;
    }, data);
  }, [data, filters]);

  const updateValue = useCallback(
    (index: number, value: FilterValue) =>
      setFilters((prev) => updateInArrayState(prev, index, value)),
    []
  );

  const updateType = useCallback(
    (index: number, value: FilterType) =>
      setFilters((prev) => updateInArrayStateType(prev, index, value)),
    []
  );

  const filtersState: FilterExtended<DataType>[] = useMemo(
    () =>
      filters.map((filter, index) => {
        if (
          filter.type === FilterType.WITHIN_RANGE ||
          filter.type === FilterType.OUTSIDE_RANGE
        ) {
          const val: [number, number] = isArrayValue(filter.value)
            ? filter.value
            : [coerceValueToNumber(filter.value), 0];

          return {
            ...filter,
            value: val,
            min: val[0],
            max: val[1],
            setMin: (value?: number) =>
              updateValue(index, [value || 0, val[1]]),
            setMax: (value?: number) =>
              updateValue(index, [val[0], value || 0]),
            toggleKey: (key: Paths<DataType>) =>
              setFilters((prev) => toggleFilterKeys(prev, index, key)),
            setType: (value: FilterType) => updateType(index, value),
          };
        } else {
          const val = isArrayValue(filter.value) ? '' : filter.value;

          return {
            ...filter,
            value: val,
            setValue: (value: FilterValue) => updateValue(index, value),
            toggleKey: (key: Paths<DataType>) =>
              setFilters((prev) => toggleFilterKeys(prev, index, key)),
            setType: (value: FilterType) => updateType(index, value),
          };
        }
      }),
    [JSON.stringify(filters)]
  );

  const filtersStateObj = useMemo(() => {
    return filtersState.reduce<FiltersStateObj<DataType>>((acc, curr) => {
      return {
        ...acc,
        [curr.name]: curr,
      };
    }, {});
  }, [filtersState]);

  const getFilter = useCallback(
    (name: string) => filtersStateObj[name],
    [filtersStateObj]
  );

  const filterIsSelected = useCallback(
    (name: string) => !!getFilter(name),
    [filtersStateObj]
  );

  const addFilter = useCallback(
    (filter: Filter<DataType>) => setFilters((prev) => [...prev, filter]),
    []
  );

  const deleteFilter = useCallback(
    (name: string) =>
      setFilters((prev) => [...prev.filter((filter) => filter.name !== name)]),
    []
  );

  const toggleFilter = useCallback(
    (filter: Filter<DataType>) => {
      return filterIsSelected(filter.name)
        ? deleteFilter(filter.name)
        : addFilter(filter);
    },
    [deleteFilter, addFilter, filterIsSelected]
  );

  const updateFilter = useCallback(
    (name: string, update: Partial<Filter<DataType>>) =>
      setFilters((prev) =>
        prev.map((filter) => {
          if (filter.name === name) {
            return {
              ...filter,
              ...update,
            };
          }
          return filter;
        })
      ),
    []
  );

  const clear = useCallback(() => setFilters([]), []);

  const objectPaths = useObjectPaths(data, keyLabels);

  return {
    filteredData,
    filtersState,
    filtersStateObj,
    filterIsSelected,
    addFilter,
    deleteFilter,
    updateFilter,
    getFilter,
    clear,
    setFilters,
    toggleFilter,
    objectPaths,
  };
};

export default useFilter;
