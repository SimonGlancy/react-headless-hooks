import { renderHook, act } from '@testing-library/react-hooks';

import useFilter from './useFilter';
import { FilterType } from './useFilter.types';

const data = [
  {
    id: 'Simon',
    name: 'Simon',
    count: 100,
    number: '100',
    complexKey: '123444',
    createdAt: new Date(1985, 6, 31, 10, 33, 30, 0).toString(),
    price: {
      currency: 'GBP',
      amount: '1200',
    },
  },
  {
    id: 'eamon',
    name: 'eamon',
    count: 100,
    number: '1001',
    complexKey: '123444',
    createdAt: new Date(1958, 6, 31, 10, 33, 30, 0).toString(),
    price: {
      currency: 'GBP',
      amount: '1200',
    },
  },
  {
    id: 'emma2',
    name: 'emma',
    count: 90,
    number: '0012',
    complexKey: '123444',
    createdAt: new Date(1978, 6, 31, 10, 33, 30, 0).toString(),
    price: {
      currency: 'GBP',
      amount: '120000',
    },
  },
  {
    id: 'Mike',
    name: 'Mike',
    count: 10,
    number: '10',
    complexKey: '1234s',
    createdAt: new Date(1944, 11, 23, 10, 33, 30, 0).toString(),
    price: {
      currency: 'GBP',
      amount: '12000',
    },
  },
  {
    id: 'Emma',
    name: 'Emma',
    count: 1,
    number: '1',
    complexKey: '234s',
    createdAt: new Date(1998, 1, 2, 10, 33, 30, 0).toString(),
    price: {
      currency: 'GBP',
      amount: '120',
    },
  },
  {
    id: 'Oreo',
    name: 'Oreo',
    number: '199',
    count: 101,
    complexKey: '34s',
    createdAt: new Date().toString(),
    price: {
      currency: 'ZAR',
      amount: '12',
    },
  },
];

const objectPaths = [
  { key: 'id', label: 'id' },
  { key: 'name', label: 'name' },
  { key: 'count', label: 'count' },
  { key: 'number', label: 'number' },
  { key: 'complexKey', label: 'complexKey' },
  { key: 'createdAt', label: 'createdAt' },
  { key: 'price.currency', label: 'price.currency' },
  { key: 'price.amount', label: 'price.amount' },
];

const SEARCH_FILTER_NAME = 'Search';
const RANGE_FILTER = 'Range';

describe('should allow user to filter data', () => {
  it('should return all data if no filters present', () => {
    const { result } = renderHook(() => useFilter({ data, filters: [] }));

    expect(result.current.filteredData).toStrictEqual(data);
    expect(result.current.filtersState).toStrictEqual([]);

    expect(result.current.objectPaths).toStrictEqual(objectPaths);
  });

  it('if filter is of invalid type all data should be returned', () => {
    const { result } = renderHook(() =>
      useFilter({
        data,
        filters: [
          {
            name: SEARCH_FILTER_NAME,
            type: 'invalid' as unknown as FilterType,
            keys: ['name'],
            value: 'emm',
          },
        ],
      })
    );

    expect(result.current.filteredData).toStrictEqual(data);
    expect(result.current.filtersState.length).toStrictEqual(1);

    expect(result.current.objectPaths).toStrictEqual(objectPaths);
  });

  it('can be initialised with filters for search (includes)', () => {
    const { result } = renderHook(() =>
      useFilter({
        data,
        filters: [
          {
            name: SEARCH_FILTER_NAME,
            type: FilterType.INCLUDES,
            keys: ['name'],
            value: 'emm',
          },
        ],
      })
    );

    expect(result.current.filteredData).toStrictEqual([data[2], data[4]]);
    expect(typeof result.current.getFilter).toStrictEqual('function');
    expect(result.current.filterIsSelected(SEARCH_FILTER_NAME)).toBe(true);
    expect(Object.keys(result.current.filtersStateObj)).toStrictEqual([SEARCH_FILTER_NAME]);
    // getFilter takes the name property and returns the filter
    const searchFilter = result.current.getFilter(SEARCH_FILTER_NAME);

    //filter is updated to have functions to update itself, change the value, change the keys
    // it is filtering on, update the value

    expect(typeof searchFilter.setValue).toStrictEqual('function');
    expect(typeof searchFilter.setType).toStrictEqual('function');
    expect(typeof searchFilter.toggleKey).toStrictEqual('function');

    // set Min and Max only available on range type filters
    expect(searchFilter.setMin).toBe(undefined);
    expect(searchFilter.setMax).toBe(undefined);

    act(() => {
      searchFilter?.setValue?.('oreo');
    });
    //updating the search string returns different data
    expect(result.current.filteredData).toStrictEqual([data[5]]);

    act(() => {
      searchFilter?.toggleKey?.('name');
    });

    //by toggling the key the search is removed
    expect(result.current.filteredData).toStrictEqual(data);

    act(() => {
      searchFilter?.setType?.(FilterType.EQUAL);
      searchFilter?.toggleKey?.('id');
      searchFilter?.setValue?.('emma2');
    });

    //update the filter to equal type and filter on the id key

    expect(result.current.filteredData).toStrictEqual([data[2]]);
  });

  it('can be initialised with filters for search (excludes)', () => {
    const { result } = renderHook(() =>
      useFilter({
        data,
        filters: [
          {
            name: SEARCH_FILTER_NAME,
            type: FilterType.EXCLUDES,
            keys: ['name'],
            value: 'emm',
          },
        ],
      })
    );

    expect(result.current.filteredData).toStrictEqual(
      data.filter(
        (item) => !String(item.name).toLocaleLowerCase().includes('emm'.toString().toLowerCase())
      )
    );
  });

  it('allows user to add a range filter', () => {
    const { result } = renderHook(() => useFilter({ data, filters: [] }));

    expect(result.current.filteredData).toStrictEqual(data);
    expect(result.current.filtersState).toStrictEqual([]);

    expect(result.current.objectPaths).toStrictEqual(objectPaths);

    act(() => {
      result.current.addFilter({
        name: RANGE_FILTER,
        type: FilterType.WITHIN_RANGE,
        keys: ['price.amount'],
        value: [100, 2000],
      });
    });

    const rangeFilter = result.current.getFilter(RANGE_FILTER);

    //filter is updated to have functions to update itself, change the value, change the keys
    // it is filtering on, update the value
    // set Min and Max only available on range type filters
    expect(typeof rangeFilter.setMin).toBe('function');
    expect(typeof rangeFilter.setMax).toBe('function');

    expect(typeof rangeFilter.setType).toStrictEqual('function');
    expect(typeof rangeFilter.toggleKey).toStrictEqual('function');

    // because this is a range filter setValue is no longer available
    expect(rangeFilter.setValue).toStrictEqual(undefined);

    expect(result.current.filteredData).toStrictEqual([data[0], data[1], data[4]]);

    act(() => {
      rangeFilter?.setMin?.(200);
    });

    expect(result.current.filteredData).toStrictEqual([data[0], data[1]]);

    act(() => {
      rangeFilter?.setMin?.(100);
      rangeFilter?.setMax?.(200);
    });

    expect(result.current.filteredData).toStrictEqual([data[4]]);

    act(() => {
      rangeFilter?.setType?.(FilterType.OUTSIDE_RANGE);
    });

    expect(result.current.filteredData).toStrictEqual(data.filter((_, index) => index !== 4));

    act(() => {
      rangeFilter?.toggleKey?.('price.amount');
    });

    expect(result.current.filteredData).toStrictEqual(data);
  });

  it('switching between filter types does not cause errors', () => {
    const { result } = renderHook(() =>
      useFilter({
        data,
        filters: [
          {
            name: SEARCH_FILTER_NAME,
            type: FilterType.INCLUDES,
            keys: ['name'],
            value: 'emm',
          },
        ],
      })
    );

    const searchFilter = result.current.getFilter(SEARCH_FILTER_NAME);

    act(() => {
      searchFilter?.setType?.(FilterType.WITHIN_RANGE);
    });

    const searchFilter2 = result.current.getFilter(SEARCH_FILTER_NAME);

    //when switching from a single value to range, if the value cannot be converted to a number the range
    // is set to [0,0]

    expect(searchFilter2.value).toStrictEqual([0, 0]);
    expect(searchFilter2.type).toBe(FilterType.WITHIN_RANGE);

    //interact with the filter
    act(() => {
      searchFilter2?.setMax?.(100);
    });

    expect(result.current.getFilter(SEARCH_FILTER_NAME).value).toStrictEqual([0, 100]);

    //change the filter type
    act(() => {
      searchFilter2?.setType?.(FilterType.LESS_THAN);
    });

    const searchFilter3 = result.current.getFilter(SEARCH_FILTER_NAME);

    expect(searchFilter3.type).toBe(FilterType.LESS_THAN);
    expect(searchFilter3.value).toStrictEqual('');
  });

  it('can delete filters both by name and by clearing the filters array', () => {
    const { result } = renderHook(() =>
      useFilter({
        data,
        filters: [
          {
            name: SEARCH_FILTER_NAME,
            type: FilterType.INCLUDES,
            keys: ['name'],
            value: 'emm',
          },
          {
            name: RANGE_FILTER,
            type: FilterType.WITHIN_RANGE,
            keys: ['price.amount'],
            value: [100, 2000],
          },
        ],
      })
    );

    act(() => {
      result.current.deleteFilter(SEARCH_FILTER_NAME);
    });

    expect(result.current.filtersState.length).toBe(1);

    act(() => {
      result.current.clear();
    });

    expect(result.current.filtersState.length).toBe(0);
  });

  it('when setMin and setMax are called with undefined, 0 is returned', () => {
    const { result } = renderHook(() =>
      useFilter({
        data,
        filters: [
          {
            name: RANGE_FILTER,
            type: FilterType.WITHIN_RANGE,
            keys: ['price.amount'],
            value: [100, 2000],
          },
        ],
      })
    );

    act(() => {
      result.current.getFilter(RANGE_FILTER)?.setMin?.(undefined);
    });

    act(() => {
      result.current.getFilter(RANGE_FILTER)?.setMax?.(undefined);
    });

    expect(result.current.getFilter(RANGE_FILTER).value).toStrictEqual([0, 0]);
  });

  it('can toggle a filter on and off', () => {
    const { result } = renderHook(() =>
      useFilter({
        data,
        filters: [
          {
            name: SEARCH_FILTER_NAME,
            type: FilterType.INCLUDES,
            keys: ['name'],
            value: 'emm',
          },
          {
            name: RANGE_FILTER,
            type: FilterType.WITHIN_RANGE,
            keys: ['price.amount'],
            value: [100, 2000],
          },
        ],
      })
    );

    act(() => {
      result.current.toggleFilter(result.current.getFilter(SEARCH_FILTER_NAME));
    });

    expect(result.current.getFilter(SEARCH_FILTER_NAME)).toBe(undefined);
    expect(result.current.filtersState.length).toBe(1);

    act(() => {
      result.current.toggleFilter({
        name: SEARCH_FILTER_NAME,
        type: FilterType.INCLUDES,
        keys: ['name'],
        value: 'emm',
      });
    });

    expect(result.current.getFilter(SEARCH_FILTER_NAME).name).toBe(SEARCH_FILTER_NAME);
    expect(result.current.filtersState.length).toBe(2);
  });
  it('can update a filter at a global level', () => {
    const { result } = renderHook(() =>
      useFilter({
        data,
        filters: [
          {
            name: SEARCH_FILTER_NAME,
            type: FilterType.INCLUDES,
            keys: ['name'],
            value: 'emm',
          },
        ],
      })
    );

    act(() => {
      result.current.updateFilter(SEARCH_FILTER_NAME, { type: FilterType.EXCLUDES, value: 'Oreo' });
    });

    expect(result.current.getFilter(SEARCH_FILTER_NAME).type).toBe(FilterType.EXCLUDES);
    expect(result.current.getFilter(SEARCH_FILTER_NAME).value).toBe('Oreo');

    // unhappy path: no filter by that name
    act(() => {
      result.current.updateFilter('Searcccch', { type: FilterType.INCLUDES, value: 'One' });
    });

    expect(result.current.getFilter(SEARCH_FILTER_NAME).type).toBe(FilterType.EXCLUDES);
    expect(result.current.getFilter(SEARCH_FILTER_NAME).value).toBe('Oreo');
  });
});
