import { renderHook, act } from '@testing-library/react-hooks';

import useSelected from './useSelected';
import { SelectTypeEnum, UseSelectedProps } from './useSelected.types';

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

describe('should allow user to select elements from a list', () => {
  it('on initial mount meta props convey state', () => {
    const { result } = renderHook(() =>
      useSelected({
        data,
        selectType: SelectTypeEnum.BY_ID,
        getItemId: (item) => item.id,
      })
    );

    expect(result.current.dataTotal).toBe(2);
    expect(result.current.selected).toStrictEqual({});
    expect(result.current.selectedData).toStrictEqual([]);
    expect(result.current.selectCount).toBe(0);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.objectPaths).toStrictEqual(objectPaths);
  });

  it('on initial mount meta props convey state, with initialSelected value', () => {
    const { result } = renderHook(() =>
      useSelected({
        data,
        selectType: SelectTypeEnum.BY_ID,
        getItemId: (item) => item.id,
        initialSelected: { Simon: true },
      })
    );

    expect(result.current.dataTotal).toBe(2);
    expect(result.current.selected).toStrictEqual({ Simon: true });
    expect(result.current.selectedData).toStrictEqual([data[0]]);
    expect(result.current.selectCount).toBe(1);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.objectPaths).toStrictEqual(objectPaths);
  });

  it('allows for item to be selected', () => {
    const { result } = renderHook(() =>
      useSelected({
        data,
        selectType: SelectTypeEnum.BY_ID,
        getItemId: (item) => item.id,
      })
    );

    expect(result.current.dataTotal).toBe(2);
    expect(result.current.selected).toStrictEqual({});
    expect(result.current.selectedData).toStrictEqual([]);
    expect(result.current.selectCount).toBe(0);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.objectPaths).toStrictEqual(objectPaths);

    act(() => {
      result.current.select(data[1], 1);
    });

    expect(result.current.selected).toStrictEqual({ eamon: true });
    expect(result.current.selectedData).toStrictEqual([data[1]]);
  });

  it('allows for more than one item to be selected', () => {
    const { result } = renderHook(() =>
      useSelected({
        data,
        selectType: SelectTypeEnum.BY_ID,
        getItemId: (item) => item.id,
      })
    );

    expect(result.current.dataTotal).toBe(2);
    expect(result.current.selected).toStrictEqual({});
    expect(result.current.selectedData).toStrictEqual([]);
    expect(result.current.selectCount).toBe(0);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.objectPaths).toStrictEqual(objectPaths);

    act(() => {
      result.current.select(data[1], 1);
    });

    expect(result.current.selected).toStrictEqual({ eamon: true });
    expect(result.current.selectedData).toStrictEqual([data[1]]);

    act(() => {
      result.current.select(data[0], 0);
    });

    expect(result.current.selected).toStrictEqual({ eamon: true, Simon: true });
    expect(result.current.selectedData).toStrictEqual([data[1], data[0]]);
    expect(result.current.allSelected).toBe(true);
  });

  it('allows for a value to be deselected', () => {
    const { result } = renderHook(() =>
      useSelected({
        data,
        selectType: SelectTypeEnum.BY_ID,
        getItemId: (item) => item.id,
        initialSelected: { Simon: true },
      })
    );

    expect(result.current.dataTotal).toBe(2);
    expect(result.current.selected).toStrictEqual({ Simon: true });
    expect(result.current.selectedData).toStrictEqual([data[0]]);
    expect(result.current.selectCount).toBe(1);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.objectPaths).toStrictEqual(objectPaths);

    act(() => {});
  });

  it('allows for an item to be toggled, selected then deselected', () => {
    const { result } = renderHook(() =>
      useSelected({
        data,
        selectType: SelectTypeEnum.BY_ID,
        getItemId: (item) => item.id,
      })
    );

    expect(result.current.dataTotal).toBe(2);
    expect(result.current.selected).toStrictEqual({});
    expect(result.current.selectedData).toStrictEqual([]);
    expect(result.current.selectCount).toBe(0);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.objectPaths).toStrictEqual(objectPaths);

    act(() => {
      result.current.toggle(data[1], 1);
    });

    expect(result.current.selected).toStrictEqual({ eamon: true });
    expect(result.current.selectedData).toStrictEqual([data[1]]);

    act(() => {
      result.current.toggle(data[1], 1);
    });

    expect(result.current.selected).toStrictEqual({ eamon: false });
    expect(result.current.selectedData).toStrictEqual([]);
    expect(result.current.allSelected).toBe(false);
  });

  it('selectAll allows for all items to be selected', () => {
    const { result } = renderHook(() =>
      useSelected({
        data,
        selectType: SelectTypeEnum.BY_ID,
        getItemId: (item) => item.id,
      })
    );

    expect(result.current.dataTotal).toBe(2);
    expect(result.current.selected).toStrictEqual({});
    expect(result.current.selectedData).toStrictEqual([]);
    expect(result.current.selectCount).toBe(0);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.objectPaths).toStrictEqual(objectPaths);

    act(() => {
      result.current.selectAll();
    });

    expect(result.current.selected).toStrictEqual({ eamon: true, Simon: true });
    expect(result.current.selectedData).toStrictEqual(data);
    expect(result.current.allSelected).toBe(true);
  });

  it('selectAll allows for all items to be de selected', () => {
    const { result } = renderHook(() =>
      useSelected({
        data,
        selectType: SelectTypeEnum.BY_ID,
        getItemId: (item) => item.id,
        initialSelected: { Simon: true },
      })
    );

    expect(result.current.dataTotal).toBe(2);
    expect(result.current.selected).toStrictEqual({ Simon: true });
    expect(result.current.selectedData).toStrictEqual([data[0]]);
    expect(result.current.selectCount).toBe(1);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.objectPaths).toStrictEqual(objectPaths);

    act(() => {
      result.current.clear();
    });

    expect(result.current.selected).toStrictEqual({});
    expect(result.current.selectedData).toStrictEqual([]);
    expect(result.current.allSelected).toBe(false);
  });

  it('toggleSelectAll allows for all items to be selected and  de selected', () => {
    const { result } = renderHook(() =>
      useSelected({
        data,
        selectType: SelectTypeEnum.BY_ID,
        getItemId: (item) => item.id,
        initialSelected: { Simon: true },
      })
    );

    expect(result.current.dataTotal).toBe(2);
    expect(result.current.selected).toStrictEqual({ Simon: true });
    expect(result.current.selectedData).toStrictEqual([data[0]]);
    expect(result.current.selectCount).toBe(1);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.objectPaths).toStrictEqual(objectPaths);

    act(() => {
      result.current.toggleSelectAll();
    });

    expect(result.current.selected).toStrictEqual({ Simon: true, eamon: true });
    expect(result.current.selectedData).toStrictEqual(data);
    expect(result.current.allSelected).toBe(true);

    act(() => {
      result.current.toggleSelectAll();
    });

    expect(result.current.selected).toStrictEqual({});
    expect(result.current.selectedData).toStrictEqual([]);
    expect(result.current.allSelected).toBe(false);
  });

  it('can disable allselected and call it with a function', () => {
    const { result } = renderHook(() =>
      useSelected({
        data,
        selectType: SelectTypeEnum.BY_ID,
        getItemId: (item) => item.id,
        initialSelected: { Simon: true },
        withAutoSelect: false,
      })
    );

    expect(result.current.selected).toStrictEqual({ Simon: true });
    expect(result.current.selectedData).toStrictEqual(undefined);
    expect(result.current.allSelected).toBe(false);

    let selectedResult;

    act(() => {
      selectedResult = result.current.selectData();
    });

    expect(selectedResult).toStrictEqual([data[0]]);
  });

  it('allows the index of the item in the arrayto be used as the primary key', () => {
    const { result } = renderHook(() =>
      useSelected({
        data,
        selectType: SelectTypeEnum.BY_INDEX,
        getItemId: (item) => item.id,
        initialSelected: { 0: true },
      })
    );

    expect(result.current.selected).toStrictEqual({ 0: true });
    expect(result.current.selectedData).toStrictEqual([data[0]]);
    expect(result.current.allSelected).toBe(false);
  });

  it('allows the index to be used to select an item', () => {
    const { result } = renderHook((props) => useSelected(props), {
      initialProps: {
        data,
        selectType: SelectTypeEnum.BY_INDEX,
        getItemId: (item: typeof data[0]) => item.id,
      } as UseSelectedProps<typeof data[0]>,
    });

    expect(result.current.selected).toStrictEqual({});
    expect(result.current.selectedData).toStrictEqual([]);
    expect(result.current.allSelected).toBe(false);

    act(() => {
      result.current.toggle(data[0], 0);
    });

    expect(result.current.selected).toStrictEqual({ 0: true });
    expect(result.current.selectedData).toStrictEqual([data[0]]);
    expect(result.current.allSelected).toBe(false);
  });

  it('by using previous index will remain correct event when order of data is changed, i.e it is sorted differently', () => {
    const { result, rerender } = renderHook((props) => useSelected(props), {
      initialProps: {
        data,
        selectType: SelectTypeEnum.BY_INDEX,
        getItemId: (item: typeof data[0]) => item.id,
        initialSelected: { 0: true },
      } as UseSelectedProps<typeof data[0]>,
    });

    expect(result.current.selected).toStrictEqual({ 0: true });
    expect(result.current.selectedData).toStrictEqual([data[0]]);
    expect(result.current.allSelected).toBe(false);

    rerender({
      data: [data[1], data[0]],
      selectType: SelectTypeEnum.BY_INDEX,
      getItemId: (item: typeof data[0]) => item.id,
    } as UseSelectedProps<typeof data[0]>);

    expect(result.current.selected).toStrictEqual({ 1: true });
    expect(result.current.selectedData).toStrictEqual([data[0]]);
    expect(result.current.allSelected).toBe(false);
  });
});
