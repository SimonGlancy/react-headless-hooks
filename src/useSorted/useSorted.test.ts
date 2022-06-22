import { renderHook, act } from '@testing-library/react-hooks';

import useSorted from './useSorted';
import { SortDirection } from './useSorted.types';

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

describe('useSorted', () => {
  it('initialState empty state', () => {
    const { result } = renderHook(() => useSorted({ data }));

    expect(result.current.sortedData).toStrictEqual(data);
    expect(result.current.sortKey).toStrictEqual(undefined);
    expect(result.current.direction).toStrictEqual(SortDirection.DESCENDING);
    expect(result.current.objectPaths).toStrictEqual(objectPaths);
  });

  it('allows for sort key to be set and different sort algorythms to be specified', () => {
    const { result } = renderHook(() =>
      useSorted({
        data,
        initialSortKey: 'count',
        sortTypes: {
          createdAt: 'datetime',
          name: 'alphanumeric',
          number: 'numeric',
          'price.amount': 'numeric',
          'price.currency': (a, b) => {
            // showing custom sort function injection
            if (typeof a === 'string' && typeof b === 'string') {
              if (b[0] === 'Z' && a[0] === 'G') {
                return -1;
              }
              return 1;
            }
            return 0;
          },
        },
      })
    );
    // sort by count
    expect(result.current.sortedData[0]).toStrictEqual(data[5]);
    expect(result.current.sortKey).toStrictEqual('count');
    expect(result.current.direction).toStrictEqual(SortDirection.DESCENDING);

    // change sort direction
    act(() => {
      result.current.setDirection(SortDirection.ASCENDING);
    });

    // item is now at the end
    expect(result.current.sortedData[result.current.sortedData.length - 1]).toStrictEqual(data[5]);
    expect(result.current.direction).toStrictEqual(SortDirection.ASCENDING);

    // change sort key to amount using toggle
    act(() => {
      result.current.toggleSortKey('price.amount');
    });

    expect(result.current.sortedData[0]).toStrictEqual(data[2]);
    expect(result.current.sortKey).toStrictEqual('price.amount');
    expect(result.current.direction).toStrictEqual(SortDirection.DESCENDING);
    // change sort direction
    act(() => {
      result.current.setDirection(SortDirection.ASCENDING);
    });

    expect(result.current.sortedData[result.current.sortedData.length - 1]).toStrictEqual(data[2]);
    expect(result.current.direction).toStrictEqual(SortDirection.ASCENDING);

    // change sort key to name using setSortKy
    act(() => {
      result.current.setSortKey('name');
    });

    expect(result.current.sortedData[0]).toStrictEqual(data[0]);
    expect(result.current.sortKey).toStrictEqual('name');
    expect(result.current.direction).toStrictEqual(SortDirection.DESCENDING);

    // change sort direction
    act(() => {
      result.current.toggleDirection();
    });

    expect(result.current.sortedData[result.current.sortedData.length - 1]).toStrictEqual(data[0]);
    expect(result.current.direction).toStrictEqual(SortDirection.ASCENDING);

    // change sort key to createdAt using setSortKy
    act(() => {
      result.current.setSortKey('createdAt');
    });

    expect(result.current.sortedData[0]).toStrictEqual(data[5]);
    expect(result.current.sortKey).toStrictEqual('createdAt');
    expect(result.current.direction).toStrictEqual(SortDirection.DESCENDING);

    // change sort direction
    act(() => {
      result.current.toggleDirection();
    });

    expect(result.current.sortedData[result.current.sortedData.length - 1]).toStrictEqual(data[5]);
    expect(result.current.direction).toStrictEqual(SortDirection.ASCENDING);

    // change sort key to createdAt using setSortKy
    act(() => {
      result.current.setSortKey('price.currency');
    });

    expect(result.current.sortedData[0]).toStrictEqual(data[5]);
    expect(result.current.sortKey).toStrictEqual('price.currency');
    expect(result.current.direction).toStrictEqual(SortDirection.DESCENDING);

    act(() => {
      result.current.toggleDirection();
    });

    expect(result.current.sortedData[result.current.sortedData.length - 1]).toStrictEqual(data[5]);
    expect(result.current.direction).toStrictEqual(SortDirection.ASCENDING);

    // remove the sort

    act(() => {
      result.current.removeSortKey('price.currency');
    });

    expect(result.current.sortKey).toStrictEqual(undefined);
  });

  it('toggleSortKey sets the direction accordingly', () => {
    const { result } = renderHook(() =>
      useSorted({
        data,
        initialSortKey: 'count',
        initialSortDirection: SortDirection.ASCENDING,
      })
    );

    expect(result.current.direction).toBe(SortDirection.ASCENDING);

    act(() => {
      result.current.toggleSortKey('count');
    });

    expect(result.current.direction).toBe(SortDirection.DESCENDING);
  });
});
