import { renderHook, act } from '@testing-library/react-hooks';

import useStepper from './useStepper';

describe('useStepper', () => {
  it('initialises with values as expected', () => {
    const { result } = renderHook(() => useStepper({ steps: 10 }));

    expect(result.current.step).toBe(1);
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(false);
    expect(result.current.percentComplete).toBe(0);
    expect(typeof result.current.next).toBe('function');
    expect(typeof result.current.previous).toBe('function');
    expect(typeof result.current.goTo).toBe('function');
  });

  it('can be initialised with different values', () => {
    const { result } = renderHook(() => useStepper({ steps: 10, initialStep: 10 }));

    expect(result.current.step).toBe(10);
    expect(result.current.canGoForwards).toBe(false);
    expect(result.current.canGoBackwards).toBe(true);
    expect(result.current.percentComplete).toBe(90);
    expect(typeof result.current.next).toBe('function');
    expect(typeof result.current.previous).toBe('function');
    expect(typeof result.current.goTo).toBe('function');
  });

  it('can step through all of the steps', () => {
    const { result } = renderHook(() => useStepper({ steps: 3 }));

    expect(result.current.step).toBe(1);
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(false);

    act(() => {
      result.current.next();
    });

    expect(result.current.step).toBe(2);
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(true);

    act(() => {
      result.current.next();
    });

    expect(result.current.step).toBe(3);
    expect(result.current.canGoForwards).toBe(false);
    expect(result.current.canGoBackwards).toBe(true);
    expect(result.current.percentComplete).toBe(66);
    // can't go beyond the steps
    act(() => {
      result.current.next();
    });

    expect(result.current.step).toBe(3);
    expect(result.current.canGoForwards).toBe(false);
    expect(result.current.canGoBackwards).toBe(true);
    expect(result.current.percentComplete).toBe(66);
  });

  it('can step backwards through all of the steps', () => {
    const { result } = renderHook(() => useStepper({ steps: 3, initialStep: 3 }));

    expect(result.current.step).toBe(3);
    expect(result.current.canGoForwards).toBe(false);
    expect(result.current.canGoBackwards).toBe(true);

    act(() => {
      result.current.previous();
    });

    expect(result.current.step).toBe(2);
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(true);

    act(() => {
      result.current.previous();
    });

    expect(result.current.step).toBe(1);
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(false);
    expect(result.current.percentComplete).toBe(0);
    // can't go back past 1
    act(() => {
      result.current.previous();
    });

    expect(result.current.step).toBe(1);
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(false);
    expect(result.current.percentComplete).toBe(0);
  });

  it('go to a specific step', () => {
    const { result } = renderHook(() => useStepper({ steps: 10 }));

    expect(result.current.step).toBe(1);
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(false);

    act(() => {
      result.current.goTo(6);
    });

    expect(result.current.step).toBe(6);
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(true);
    expect(result.current.percentComplete).toBe(50);
  });

  it('initialStep defaults to 1 if out of range', () => {
    const { result } = renderHook(() => useStepper({ steps: 10, initialStep: 11 }));

    expect(result.current.step).toBe(1);
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(false);
  });

  it('initialStep defaults to 1 if out of range', () => {
    const { result } = renderHook(() => useStepper({ steps: 10, initialStep: 0 }));

    expect(result.current.step).toBe(1);
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(false);
  });

  it('goTo can only go to a number within range', () => {
    const { result } = renderHook(() => useStepper({ steps: 10 }));

    expect(result.current.step).toBe(1);
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(false);

    act(() => {
      result.current.goTo(11);
    });

    expect(result.current.step).toBe(1);
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(false);

    act(() => {
      result.current.goTo(0);
    });

    expect(result.current.step).toBe(1);
    expect(result.current.canGoForwards).toBe(true);
    expect(result.current.canGoBackwards).toBe(false);
  });

  it('can configure the percentage value', () => {
    const { result } = renderHook(() =>
      useStepper({ steps: 3, initialStep: 3, percentageDecimal: 2 })
    );

    expect(result.current.step).toBe(3);
    expect(result.current.canGoForwards).toBe(false);
    expect(result.current.canGoBackwards).toBe(true);
    expect(result.current.percentComplete).toBe(66);
  });
});
