import { renderHook, act } from '@testing-library/react-hooks';

import usePagination from './usePagination';

const data = [{ id: 1 }, { id: 2 }, { id: 3 }];

describe('usePagination', () => {
  it('initialises with values as expected', () => {
    const { result } = renderHook(() => usePagination({ data }));

    expect(result.current.pages).toStrictEqual({
      1: [{ id: 1 }],
      2: [{ id: 2 }],
      3: [{ id: 3 }],
    });
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(false);
    expect(result.current.currentPage).toStrictEqual(1);
    expect(result.current.currentPageData).toStrictEqual([{ id: 1 }]);
    expect(typeof result.current.next).toBe('function');
    expect(typeof result.current.previous).toBe('function');
    expect(typeof result.current.goTo).toBe('function');
  });

  it('can be initialised with other values and can step through pages', () => {
    const { result } = renderHook(() => usePagination({ data, pageSize: 2 }));

    expect(result.current.pages).toStrictEqual({
      1: [{ id: 1 }, { id: 2 }],
      2: [{ id: 3 }],
    });
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(false);
    expect(result.current.currentPage).toStrictEqual(1);
    expect(result.current.currentPageData).toStrictEqual([{ id: 1 }, { id: 2 }]);
    expect(typeof result.current.next).toBe('function');
    expect(typeof result.current.previous).toBe('function');
    expect(typeof result.current.goTo).toBe('function');

    act(() => {
      result.current.next();
    });

    expect(result.current.canGoForwards).toBe(false);
    expect(result.current.canGoBackwards).toBe(true);
    expect(result.current.currentPage).toStrictEqual(2);
    expect(result.current.currentPageData).toStrictEqual([{ id: 3 }]);
  });
});
