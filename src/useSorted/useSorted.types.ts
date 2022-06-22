import { Reducer } from 'react';
import { GenericObject, Paths } from '../types';
import { ObjectPath } from '../useObjectPaths/useObjectPaths';

export enum SortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export enum SortStateType {
  SET_SORT_KEY = 'set-sort-key',
  TOGGLE_SORT_KEY = 'toggle-sort-key',
  TOGGLE_DIRECTION = 'toggle-direction',
  SET_DIRECTION = 'set-direction',
}

export type SetSortKey<DataType> = {
  type: SortStateType.SET_SORT_KEY;
  payload?: Paths<DataType>;
};

export type ToggleDirection = {
  type: SortStateType.TOGGLE_DIRECTION;
  payload: undefined;
};

export type ToggleSortKey<DataType> = {
  type: SortStateType.TOGGLE_SORT_KEY;
  payload?: Paths<DataType>;
};

export type SetDirection = {
  type: SortStateType.SET_DIRECTION;
  payload: SortDirection;
};

export type SortActions<DataType> =
  | SetSortKey<DataType>
  | ToggleDirection
  | SetDirection
  | ToggleSortKey<DataType>;

export type SortState<DataType extends GenericObject> = {
  direction?: SortDirection;
  sortKey?: Paths<DataType>;
};

export type SortStateAction = {
  type: SortStateType;
  payload?: string | SortDirection;
};

export type KeyLabels<DataType> = Partial<Record<Paths<DataType>, string>>;

export type UseSortedProps<DataType extends GenericObject> = {
  data: DataType[];
  initialSortDirection?: SortDirection;
  initialSortKey?: Paths<DataType>;
  keyLabels?: KeyLabels<DataType>;
  sortTypes?: SortTypes<DataType>;
};

export type UseSortedReturnProps<DataType extends GenericObject> = {
  setSortKey: (key: Paths<DataType>) => void;
  removeSortKey: (key: Paths<DataType>) => void;
  toggleSortKey: (key: Paths<DataType>) => void;
  setDirection: (direction: SortDirection) => void;
  toggleDirection: () => void;
  sortKey?: Paths<DataType>;
  direction?: SortDirection;
  sortedData: DataType[];
  objectPaths: ObjectPath<DataType>[];
};

export type SortFunction = <DataType extends GenericObject>(
  a: DataType | DataType[Paths<DataType>],
  b: DataType | DataType[Paths<DataType>]
) => number;

export type SortTypes<DataType> = Partial<
  Record<
    Paths<DataType>,
    'basic' | 'alphanumeric' | 'datetime' | 'numeric' | SortFunction
  >
>;

export type SortReducerType<DataType extends Record<string, unknown>> = Reducer<
  SortState<DataType>,
  SortStateAction
>;
