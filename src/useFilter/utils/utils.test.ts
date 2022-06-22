import { GenericObject } from '../../types';
import { FilterType } from '../useFilter.types';
import {
  inArray,
  indexOf,
  push,
  unshift,
  del,
  toggleValue,
  deleteByFilter,
} from './arrayUtils';
import checkRange from './checkRange';
import coerceValueToNumber from './coerceValueToNumber';
import compare, { comparison } from './compare';
import getObjectPaths from './getPaths';
import toggleFilterKeys from './toggleFilterKeys';
import updateInArrayState from './updateInArrayState';
import updateInArrayStateType from './updateInArrayStateType';

const rangeData = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
const SEARCH_FILTER_NAME = 'Search';
describe('utils tests', () => {
  describe('coerceValueToNumber', () => {
    it('if value is a number returns the value', () => {
      const result = coerceValueToNumber(10);
      expect(result).toBe(10);
    });

    it('if value is a string that represents a number returns the value as a number', () => {
      const result = coerceValueToNumber('10');
      expect(result).toBe(10);
    });

    it('if value is a string that does not represents a number returns 0', () => {
      const result = coerceValueToNumber('10t');
      expect(result).toBe(0);
    });
  });

  describe('checkRange', () => {
    it('returns data within range when type is WITHIN_RANGE', () => {
      const result = checkRange(
        rangeData,
        ['id'],
        [2, 4],
        FilterType.WITHIN_RANGE
      );
      expect(result).toStrictEqual([{ id: 2 }, { id: 3 }, { id: 4 }]);
    });

    it('returns data outside range when type is OUTSIDE_RANGE', () => {
      const result = checkRange(
        rangeData,
        ['id'],
        [2, 4],
        FilterType.OUTSIDE_RANGE
      );
      expect(result).toStrictEqual([{ id: 1 }, { id: 5 }]);
    });
  });

  describe('arrayUtils', () => {
    it('push - puts item at the end', () => {
      const result = push([1, 2], 0);
      expect(result).toStrictEqual([1, 2, 0]);
    });
    it('unshift - puts item at the start', () => {
      const result = unshift([1, 2], 0);
      expect(result).toStrictEqual([0, 1, 2]);
    });
    it('indexOf - getsIndex of first item that meets criteria, returns -1 if not present', () => {
      const result = indexOf([1, 2], 0);
      expect(result).toStrictEqual(-1);
    });

    it('inArray - returns a boolean relating to whether item is in array', () => {
      const result = inArray([1, 2], 0);
      expect(result).toStrictEqual(false);
    });

    it('del - returns array with item removed', () => {
      const result = del([1, 2], 1);
      expect(result).toStrictEqual([2]);
    });

    it('deleteByFilter - returns array with item removed based on index', () => {
      const result = deleteByFilter([1, 2], 0);
      expect(result).toStrictEqual([2]);
    });

    it('toggleValue - adds or removes value', () => {
      const initialValue = [1, 2];
      const result = toggleValue(initialValue, 1);
      expect(result).toStrictEqual([2]);
      const result2 = toggleValue(result, 1);
      expect(result2).toStrictEqual([2, 1]);
    });
  });

  describe('compare', () => {
    it('compares values less than, returns data which satisfies the condition', () => {
      const result = compare(rangeData, ['id'], 2, FilterType.LESS_THAN);
      expect(result).toStrictEqual([{ id: 1 }]);
    });

    it('compares values less than or equal, returns data which satisfies the condition', () => {
      const result = compare(
        rangeData,
        ['id'],
        2,
        FilterType.LESS_THAN_OR_EQUAL
      );
      expect(result).toStrictEqual([{ id: 1 }, { id: 2 }]);
    });

    it('compares values more than, returns data which satisfies the condition', () => {
      const result = compare(rangeData, ['id'], 4, FilterType.MORE_THAN);
      expect(result).toStrictEqual([{ id: 5 }]);
    });

    it('compares values more than or equal, returns data which satisfies the condition', () => {
      const result = compare(
        rangeData,
        ['id'],
        4,
        FilterType.MORE_THAN_OR_EQUAL
      );
      expect(result).toStrictEqual([{ id: 4 }, { id: 5 }]);
    });

    it('compares values  equal, returns data which satisfies the condition', () => {
      const result = compare(rangeData, ['id'], 4, FilterType.EQUAL);
      expect(result).toStrictEqual([{ id: 4 }]);
    });

    it('compares values default, returns data which satisfies the condition EQUAL', () => {
      // just for test to test the default path in switch
      const result = comparison(1, 2);
      expect(result).toStrictEqual(false);
    });
  });

  describe('compare', () => {
    it('returns an array of dot notation paths of the object', () => {
      const result = getObjectPaths({
        one: { two: 1, three: [{ four: 1 }, 'five'] },
      });

      expect(result).toStrictEqual([
        'one.two',
        'one.three.0.four',
        'one.three.1',
      ]);
    });

    it('returns an array of dot notation paths of the object', () => {
      const result = getObjectPaths({});

      expect(result).toStrictEqual([]);
    });

    it('returns an empty array if not an object', () => {
      //conversion to allow non object to be used to test default return
      const result = getObjectPaths('{}' as unknown as GenericObject);

      expect(result).toStrictEqual([]);
    });
  });

  describe('toggleFilterKeys', () => {
    it('toggles the filter key if index is correct', () => {
      const result = toggleFilterKeys(
        [
          {
            name: SEARCH_FILTER_NAME,
            type: FilterType.INCLUDES,
            keys: ['name'],
            value: 'emm',
          },
        ],
        0,
        'name'
      );

      expect(result).toStrictEqual([
        {
          name: SEARCH_FILTER_NAME,
          type: FilterType.INCLUDES,
          keys: [],
          value: 'emm',
        },
      ]);
    });
    it('does not toggle the filter key if index is incorrect', () => {
      const result = toggleFilterKeys(
        [
          {
            name: SEARCH_FILTER_NAME,
            type: FilterType.INCLUDES,
            keys: ['name'],
            value: 'emm',
          },
        ],
        1,
        'name'
      );

      expect(result).toStrictEqual([
        {
          name: SEARCH_FILTER_NAME,
          type: FilterType.INCLUDES,
          keys: ['name'],
          value: 'emm',
        },
      ]);
    });
  });
  describe('updateInArrayState', () => {
    it('updates the value within the filter state array', () => {
      const result = updateInArrayState(
        [
          {
            name: SEARCH_FILTER_NAME,
            type: FilterType.INCLUDES,
            keys: ['name'],
            value: 'emm',
          },
        ],
        0,
        'Oreo'
      );

      expect(result).toStrictEqual([
        {
          name: SEARCH_FILTER_NAME,
          type: FilterType.INCLUDES,
          keys: ['name'],
          value: 'Oreo',
        },
      ]);
    });

    it('does not update the value within the filter state array if index is incorrect', () => {
      const result = updateInArrayState(
        [
          {
            name: SEARCH_FILTER_NAME,
            type: FilterType.INCLUDES,
            keys: ['name'],
            value: 'emm',
          },
        ],
        1,
        'Oreo'
      );

      expect(result).toStrictEqual([
        {
          name: SEARCH_FILTER_NAME,
          type: FilterType.INCLUDES,
          keys: ['name'],
          value: 'emm',
        },
      ]);
    });
  });

  describe('updateInArrayStateType', () => {
    it('updates the value within the filter state array', () => {
      const result = updateInArrayStateType(
        [
          {
            name: SEARCH_FILTER_NAME,
            type: FilterType.INCLUDES,
            keys: ['name'],
            value: 'emm',
          },
        ],
        0,
        FilterType.EXCLUDES
      );

      expect(result).toStrictEqual([
        {
          name: SEARCH_FILTER_NAME,
          type: FilterType.EXCLUDES,
          keys: ['name'],
          value: 'emm',
        },
      ]);
    });

    it('does not update the value within the filter state array if index is incorrect', () => {
      const result = updateInArrayStateType(
        [
          {
            name: SEARCH_FILTER_NAME,
            type: FilterType.INCLUDES,
            keys: ['name'],
            value: 'emm',
          },
        ],
        1,
        FilterType.EXCLUDES
      );

      expect(result).toStrictEqual([
        {
          name: SEARCH_FILTER_NAME,
          type: FilterType.INCLUDES,
          keys: ['name'],
          value: 'emm',
        },
      ]);
    });
  });
});
