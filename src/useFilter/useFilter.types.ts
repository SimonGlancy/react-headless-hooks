import { GenericObject, Paths } from '../types';
import { ObjectPath } from '../useObjectPaths/useObjectPaths';
import { KeyLabels } from '../useSorted/useSorted.types';

export enum FilterType {
  INCLUDES = 'includes',
  EXCLUDES = 'excludes',
  MORE_THAN = 'moreThan',
  LESS_THAN = 'lessThan',
  MORE_THAN_OR_EQUAL = 'moreThanOrEqual',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  EQUAL = 'equal',
  WITHIN_RANGE = 'withinRange',
  OUTSIDE_RANGE = 'outsideRange',
}

export type RangeType = FilterType.OUTSIDE_RANGE | FilterType.WITHIN_RANGE;

export type FilterValue = string | number | [number, number];

export type Filter<DataType extends GenericObject> = {
  keys: Paths<DataType>[];
  type: FilterType;
  value: FilterValue;
  name: string;
};

export type FilterExtended<DataType extends GenericObject> =
  Filter<DataType> & {
    min?: number;
    max?: number;
    setValue?: (value: FilterValue) => void;
    setMin?: (value?: number) => void;
    setMax?: (value?: number) => void;
    toggleKey?: (key: Paths<DataType>) => void;
    setType?: (value: FilterType) => void;
  };

export type FiltersStateObj<DataType extends GenericObject> = Record<
  string,
  FilterExtended<DataType>
>;

export type UseFilterReturn<DataType extends GenericObject> = {
  filteredData: DataType[];
  filtersState: FilterExtended<DataType>[];
  filtersStateObj: FiltersStateObj<DataType>;
  filterIsSelected: (name: string) => boolean;
  addFilter: (filter: Filter<DataType>) => void;
  deleteFilter: (name: string) => void;
  updateFilter: (name: string, update: Partial<Filter<DataType>>) => void;
  getFilter: (name: string) => FilterExtended<DataType>;
  clear: () => void;
  setFilters: (filters: Filter<DataType>[]) => void;
  toggleFilter: (filter: Filter<DataType>) => void;
  objectPaths?: ObjectPath<DataType>[];
};

export type UseFilterProps<DataType extends GenericObject> = {
  data: DataType[];
  filters: Filter<DataType>[];
  keyLabels?: KeyLabels<DataType>;
};
