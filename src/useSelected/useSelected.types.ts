// The inspiration for this hook is to solve the performant complexity issues
// related to selecting items from an array
// if the selected item is stored in an array it can lead to O(n^2) - Quadratic time complexity
// when trying to identify if the item in the list is in the selected array
// By storing the the selected entries as an object it is possible to remove a nested loop.

import { GenericObject } from '../types';
import { ObjectPath } from '../useObjectPaths/useObjectPaths';

// the hook returns helper functions and values to help manage the selected state

// TODO: provide Context provider and hook to allow for global selected state?

// This record has a key that either relates to a specific attribute id in an object
// or the index of an object in the array and a corresponding boolean value describing
// whether it is selected or not
// when deselecting the choice has been made to toggle the value to false instead of deleting the entry
export type SelectedObject = Record<string, boolean>;

export type SelectFunction<DataType> = (item: DataType, index: number) => void;

export type UpdateFunction<DataType> = (
  item: DataType,
  index: number,
  value: boolean
) => void;

// For object data structures the byId select mode is used, this used with the getId prop
// create an entry in the selected object keyed of a specific id attribute
// For simple data structures like strings or numbers the byIndex selectType allows the index
// to be used as the key in the selected object
export enum SelectTypeEnum {
  BY_ID = 'byId',
  BY_INDEX = 'byIndex',
}

export type UseSelectedProps<DataType> = {
  data: DataType[]; // the data that is being used to select from
  getItemId: (item: DataType) => string; // a function that can return a unique id i.e (item) => item.id
  selectType: SelectTypeEnum;
  withAutoSelect?: boolean;
  initialSelected?: SelectedObject;
  // hook returns the selected data via the selectedData attribute
  // this requires some computational logic which is optimised through memoisation
  // this may not be required and the selected data may only be required on a specific action
  // the hook also returns a selectData function which can be used to return the relevant data as required
};

export type UseSelectedReturnValues<DataType extends GenericObject> = {
  select: SelectFunction<DataType>; // select an individual item
  deselect: SelectFunction<DataType>; // de select an individual item
  toggle: SelectFunction<DataType>; // toggle selected value true -> false -> true
  getIsSelected: (item: DataType, index: number) => boolean; // returns whether item is in selected object
  clear: () => void; // clears all values in the selected object
  selectAll: () => void; // selects all of data (transforms array into normalised data set Record<string, true>)
  toggleSelectAll: () => void; // allows all items to be selected or deselected

  selectedData?: DataType[]; // array of items in selected object / can be disabled by withAutoSelect = false
  selectData: () => DataType[]; // function that returns selectedData
  selected: SelectedObject; // Selected Object, keyed either of the chosen id or the index

  selectCount: number; // number of selected items
  dataTotal: number; // number of items in data array
  allSelected: boolean; // are all items selected

  getNormalisedData: () => Record<string, DataType>;
  objectPaths?: ObjectPath<DataType>[];
};
