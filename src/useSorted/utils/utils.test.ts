import { SetStateAction } from 'react';
import { GenericObject } from '../../types';
import { SortActions, SortDirection } from '../useSorted.types';
import getComparisonValues from './getComparisonValues';
import sortReducer from './sortReducer';
import toggleDirection from './toggleDirection';
import toggleSortKey from './toggleSortKey';
import toString from './toString';

describe('utils tests', () => {
  describe('toString', () => {
    it('returns a string value if a number', () => {
      const result = toString(10);
      expect(result).toStrictEqual('10');
    });

    it('returns a string value if a string', () => {
      const result = toString('hello');
      expect(result).toStrictEqual('hello');
    });

    it('returns an empty string for Infinity if a string', () => {
      const result = toString(Infinity);
      expect(result).toStrictEqual('');
    });

    it('returns an empty string for non number or string', () => {
      const result = toString({} as unknown as string);
      expect(result).toStrictEqual('');
    });
  });
  describe('toggleSortKey', () => {
    it('returns undefined if present', () => {
      const result = toggleSortKey<{ id: string }>('id', 'id');
      expect(result).toBe(undefined);
    });

    it('returns undefined if present', () => {
      const result = toggleSortKey<{ id: string }>('id', undefined);
      expect(result).toBe('id');
    });

    it('returns undefined if present', () => {
      const result = toggleSortKey<{ id: string; key: string }>('key', 'id');
      expect(result).toBe('key');
    });
  });

  describe('getComparisonValues', () => {
    it('returns the values relating to the keys (descending)', () => {
      const result = getComparisonValues(
        { id: 1 },
        { id: 2 },
        'id',
        SortDirection.DESCENDING
      );
      expect(result).toStrictEqual([2, 1]);
    });

    it('returns the values relating to the keys (ascending)', () => {
      const result = getComparisonValues(
        { id: 1 },
        { id: 2 },
        'id',
        SortDirection.ASCENDING
      );
      expect(result).toStrictEqual([1, 2]);
    });

    it('returns the whole object if no sort key provided', () => {
      const result = getComparisonValues(
        { id: 1 },
        { id: 2 },
        undefined,
        SortDirection.ASCENDING
      );
      expect(result).toStrictEqual([{ id: 1 }, { id: 2 }]);
    });

    it('returns the whole object if no sort key provided', () => {
      const result = getComparisonValues(
        { id: 1 },
        { id: 2 },
        undefined,
        SortDirection.DESCENDING
      );
      expect(result).toStrictEqual([{ id: 2 }, { id: 1 }]);
    });
  });

  describe('toggleDirection', () => {
    it('returns the opposite to the current direction (ascending)', () => {
      const result = toggleDirection(SortDirection.ASCENDING);
      expect(result).toStrictEqual(SortDirection.DESCENDING);
    });

    it('returns the opposite to the current direction (descending', () => {
      const result = toggleDirection(SortDirection.DESCENDING);
      expect(result).toStrictEqual(SortDirection.ASCENDING);
    });
  });

  describe('sortReducer', () => {
    const result = sortReducer(
      { sortKey: undefined, direction: SortDirection.DESCENDING },
      {} as unknown as SortActions<GenericObject>
    );
    expect(result).toStrictEqual({
      sortKey: undefined,
      direction: SortDirection.DESCENDING,
    });
  });
});
