# react-headless-hooks

A collection of headless hooks

The inspiration for this library is to provide hooks to create graceful ui experiences in react with no relevant UI elements, much like [Formik](https://formik.org/) or [react-table](https://github.com/TanStack/table).

### installation

```
//npm
npm i react-headless-hooks

//yarn
yarn add react-headless-hooks
```

## usePrevious

Allows for user to keep track of a value at the previous render.

```
import { usePrevious } from 'react-headless-hooks'

--------

const [count,setCount] = useState(0)

const previousCount = usePrevious(count)

useEffect(() => {
  if(count !== previousCount) {
    <!-- do something -->
  }
}. [count,previousCount])

```

_this hook is used internally to maintain the selected by index value in the useSelected hook_

## useSelected

Hook allows user to select items from a list, providing utilities to help implement visualising whether an item is selected and to return the relevant data that is selected.

```
import { useSelected, SelectTypeEnum } from 'react-headless-hooks'

--------

const data = [
  {
    id: 'oreo-id',
    name: 'Oreo',
  }
  ... more data
]


const SelectableList = () => {
   const { getIsSelected, toggle, allSelected, toggleSelectAll, selected, selectedData } = useSelected({
    data,
    selectType: SelectTypeEnum.BY_INDEX,
    getItemId: (item) => item.id,
  });

  return <div>
    <button onClick={toggleSelectAll}>{allSelected ? 'Deselect all': 'Select all'} <button>
    <ul>
      {data.map((item,index) => {
        <li
          key={item.id}
          onClick={() => toggle(item,index)}
          style={{fontWeight: getIsSelected(item,index) ? 'bold': 'normal' }}
        >
           {item.name}
        </li>
      })}
    </ul>
  </div>

}
```

This very simple example shows how to use the hook to render a list where the elements are selectable. The hook returns two different dataTypes to describe selected elements.

#### selected

Selected is an object with either the the value returned by the getItemId function (if selectType is SelectTypeEnum.BY_INDEX) or the index in the array (if the selectType is SelectTypeEnum.BY_ID) as the key and a boolean value for the value.

In this example if the entry with name 'Oreo' was clicked selected would be as follows

```
{
  oreo-id: true
}
```

#### selectedData

This object is mapped back to an array internally so in the example above the output of selectedData would be

```
[
  {
    id: 'oreo-id',
    name: 'Oreo',
  }
]
```

it is possible to disable this functionality if it is deemed to be too memory intensive to run on every render by passing in

```
withAutoSelect: false
```

If you want to retrieve the selectedData programmatically say on a button press the hook returns a function selectData which returns the data in the same format as selectedData.

### Input props

| name            | type                                                        | required?             | description                                                                                                                                                        |
| --------------- | ----------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data            | `DataType[]`                                                | yes                   | An array of any data type. ts will infer the values                                                                                                                |
| getItemId       | `(item: DataType) => string`                                | yes                   | A function that takes the DataType and returns a string. This is used as the key for the selected object                                                           |
| selectType      | `SelectTypeEnum = { BY_ID = 'byId', BY_INDEX = 'byIndex' }` | yes                   | describes how the selected object is formed. If `byId` the object key will be the value returned by getItemId. if `byIndex` the object key will be the item index. |
| withAutoSelect  | `boolean`                                                   | no - defaults to true | Allows for the auto creation of selectedData to be turned off                                                                                                      |
| initialSelected | `Record<string,boolean>`                                    | no - defaults to {}   | Allows for selected list to be initialised with some value. The object must map to the selectType chosen.                                                          |

### Output props

| name            | type                                          | description                                                                                          |
| --------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| select          | `(item: DataType, index: number) => void;`    | select an individual item                                                                            |
| deselect        | `(item: DataType, index: number) => void;`    | deselect an individual item                                                                          |
| toggle          | `(item: DataType, index: number) => void;`    | toggle selected value true -> false -> true                                                          |
| getIsSelected   | `(item: DataType, index: number) => boolean;` | returns whether item is in selected object                                                           |
| clear           | `() => void`                                  | clears all values in the selected object                                                             |
| selectAll       | `() => void`                                  | adds all of data (transforms array into normalised data set Record<string, true>) to selected object |
| toggleSelectAll | `() => void`                                  | toggles between selectAll and clear                                                                  |
| selectedData    | `DataType[]`                                  | array of items in selected object / can be disabled by withAutoSelect = false                        |
| selectData      | `() => DataType[]`                            | function that returns selectedData                                                                   |
| selected        | `Record<string,boolean>`                      | Selected Object, keyed either of the chosen id or the index                                          |
| selectCount     | `number`                                      | number of selected items                                                                             |
| allSelected     | `boolean`                                     | are all items selected                                                                               |
| objectPaths     | `ObjectPath<DataType>[];`                     | an array of all the possible paths of the data type see useObjectPaths                               |

## useStepper

A hook that returns the current step (1 indexed) in a multistep process.

```
const { step, next, previous, canGoForwards, canGoBackwards, goTo } = useStepper({ steps: 3 })
```

### Input props

| name        | type     | required? | description                                         |
| ----------- | -------- | --------- | --------------------------------------------------- |
| steps       | `number` | yes       | total number of steps                               |
| initialStep | `number` | no        | the step to initialise useStepper on. defaults to 1 |

### Output props

| name               | type         | description                                                                                                                                  |
| ------------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| step               | `number`     | current step                                                                                                                                 |
| next               | `() => void` | increment the step by 1                                                                                                                      |
| previous           | `() => void` | decrement the step by 1                                                                                                                      |
| goTo               | `() => void` | go to a specific step, within range                                                                                                          |
| canGoForwards      | `boolean`    | boolean value describing whether step is lower than the total number of steps                                                                |
| canGoBackwards     | `boolean`    | boolean value describing whether step is higher than 1                                                                                       |
| percentageComplete | `number`     | value of completed steps represented as a percentage of steps. This relates to (step - 1 ) / steps as the current step is an incomplete step |

## usePagination

A hook that breaks a data array into arrays of a smaller 'pageSize'

```
const { currentPage, currentPageData, pages, totalPages,  ...useStepperValues } = usePagination({ data, pageSize: 10 })
```

### Input props

| name        | type         | required? | description                                     |
| ----------- | ------------ | --------- | ----------------------------------------------- |
| data        | `DataType[]` | yes       | the raw data to be paginated                    |
| pageSize    | `number`     | no        | defines the number of items to be in each chunk |
| initialPage | `number`     | no        | the initial page number that should be returned |

### Output props

| name            | type                         | description                                                                                   |
| --------------- | ---------------------------- | --------------------------------------------------------------------------------------------- |
| currentPage     | `number`                     | number of current page                                                                        |
| currentPageData | `DataType[]`                 | the data for that page                                                                        |
| pages           | `Record<number, DataType[]>` | an object where the key is the page number and the value is an array of DataType. (1 indexed) |
| totalPages      | `number`                     | total number of pages                                                                         |

_uses useStepper under the hood so all of those return values are available too, i.e next(), previous()_

## useSorted

A hook for sorting data from an array based on and attribute of the DataType. sortKeys can us dot notation to define a specific attribute within a nested object.

i.e to access the amount within a price object

```
const item = {
  price: {
    amount: 200,
    currency: GBP
  }
}
```

you could use the dot notation `price.amount`

```

const data = [
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
  ...
]

const { sortedData, direction, sortKey, objectPaths, toggleDirection, toggleSortKey } = useSorted({
  data,
  initialSortKey: 'count',
  sortTypes: {
    createdAt: 'datetime',
    name: 'alphanumeric',
    number: 'numeric'
  },
  keyLabels: {
    createdAt: 'Age'
  }
}
```

### Input props

| name                 | type                              | required?      | description                                                                                                                                                                                       |
| -------------------- | --------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------- | --- | ------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | --------------------------------------- |
| data                 | `DataType[]`                      | yes            | array of data to be sorted                                                                                                                                                                        |
| initialSortKey       | `Paths<DataType>`                 | no             | a dot notation path of the data type, describes the attribute to sort on                                                                                                                          |
| initialSortDirection | `SortDirection`                   | no             | `asc` or `desc` defines which direction the data should be sorted                                                                                                                                 |
| sortTypes            | `Record<Paths<DataType>, 'basic'  | 'alphanumeric' | 'datetime'                                                                                                                                                                                        | 'numeric' | SortFunction>` | no  | allows for custom sort functions to be used per data type. there are four types that can be specified by strings `'basic' | 'alphanumeric' | 'datetime' | 'numeric'` these will use predetermined sorting logic. it is also possible to pass in a custom function with the same signature as the callback given to the js Array.sort method. i.e ```(a: DataType | DataType[Paths<DataType>], b: DataType | DataType[Paths<DataType>]) => number``` |
| keyLabels            | `Record<Paths<DataType>, string>` | no             | this is an object with a key of a path of the object and the value of a string, this allows for the key names to be translated or given an alias human readable value. i.e `{ createdAt: 'Age' }` |

_react-headless-hooks exports a utility type Paths which validates whether a dot notation string is a valid path of an object. note that DataType must extend GenericObject which is also exported from the project._

### Output props

| name            | type                                 | description                                                                                                                                                                      |
| --------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sortedData      | `DataType[]`                         | sorted data                                                                                                                                                                      |
| direction       | `asc` or `desc`                      | describes the sort direction                                                                                                                                                     |
| toggleDirection | `() => void`                         | toggles sort direction between `asc` and `desc`                                                                                                                                  |
| setDirection    | `(direction: SortDirection) => void` | set the sort direction to a specific value (`asc` or `desc`)                                                                                                                     |
| objectPaths     | `ObjectPath<DataType>[]`             | all possible paths of the DataType as an object { key, label } where label is the translated value defined in keyLabels.. if no specific value defined it is the same as the key |
| sortKey         | `Paths<DataType>`                    | the current sort direction                                                                                                                                                       |
| setSortKey      | `(key: Paths<DataType>) => void`     | set sort key to a specific value                                                                                                                                                 |
| toggleSortKey   | `(key: Paths<DataType>) => void`     | toggle sort key between a specific value and undefined                                                                                                                           |
| removeSortKey   | `(key: Paths<DataType>) => void`     | set sort key from a specific value to undefined                                                                                                                                  |

## useFiltered

A hook for filtereing data based on an array of filters on multiple attributes of data.

```
const data = [
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
  {
    id: 'eamon',
    name: 'Eamon',
    number: '199',
    count: 101,
    complexKey: '34s',
    createdAt: new Date().toString(),
    price: {
      currency: 'GBP',
      amount: '12',
    },
  },
  ...
]

const {
  filteredData,
  getFilter
} = useFilter({
  data,
  filters: [
    {
      name: 'search',
      type: 'includes',
      keys: ['name'],
      value: 'eam',
    },
  ],
})

const searchFilter = getFilter('search')

return <input onChange={searchFilter.setValue} value={searchFilter.value} >

```

the example above would initialy only return data where the name attribute includes the string 'eam', the hook returns some utility functions that allow for the update of the filter state. getFilter takes the name attribute and returns the filter defined by the name property with some additional helper functions.

```
----- input filter value
type Filter<DataType extends GenericObject> = {
  keys: Paths<DataType>[];
  type: FilterType;
  value: FilterValue;
  name: string;
}

----- output of getFilter value
type FilterExtended = Filter & {
    min?: number;
    max?: number;
    setValue?: (value: FilterValue) => void;
    setMin?: (value?: number) => void;
    setMax?: (value?: number) => void;
    toggleKey?: (key: Paths<DataType>) => void;
    setType?: (value: FilterType) => void;
  }
```

filters can be of the following types:

```
enum FilterType {
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
```

the value of a filter is either `number`, `string` or `[number,number]`. The tuple value is used for types `withinRange` and `outsideRange`. For range filters the filter will return a `min` and `max` value as well as setMin and setMax functions.

### Input props

| name      | type                              | required? | description                                                                                                                                                                                       |
| --------- | --------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data      | `DataType[]`                      | yes       | the raw data to be filtered                                                                                                                                                                       |
| filters   | `Filter<DataType>[]`              | yes       | an array of filters, data will be filtered in order filter appears in array. each filter can be applied to multiple paths of an object                                                            |
| keyLabels | `Record<Paths<DataType>, string>` | no        | this is an object with a key of a path of the object and the value of a string, this allows for the key names to be translated or given an alias human readable value. i.e `{ createdAt: 'Age' }` |

export type UseFilterProps<DataType extends GenericObject> = {
data: DataType[];
filters: Filter<DataType>[];
keyLabels?: KeyLabels<DataType>;
};

### Output props

| name             | type                                                        | description                                                                                                                                                                      |
| ---------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| filteredData     | `DataType[]`                                                | the data returned by the filter constraints                                                                                                                                      |
| filtersState     | `FilterExtended<DataType>[]`                                | an array of filters extended to include setter methods described above                                                                                                           |
| filtersStateObj  | `FiltersStateObj<DataType>`                                 | a normalisation of the filtersState keyed off the filter name                                                                                                                    |
| getFilter        | `(name: string) => FilterExtended<DataType>`                | a function which returns the extended filter relating to the name property                                                                                                       |
| filterIsSelected | `(name: string) => boolean`                                 | a function which returns a boolean value to describe whether a filter with that name is in the flters state                                                                      |
| addFilter        | `(filter: Filter<DataType>) => void`                        | programatically add a filter to the filterState                                                                                                                                  |
| deleteFilter     | `(name: string) => void;`                                   | delete a filter from the filter state based on the name                                                                                                                          |
| updateFilter     | `(name: string, update: Partial<Filter<DataType>>) => void` | update a filter at the global level                                                                                                                                              |
| clear            | `() => void`                                                | remove all filters                                                                                                                                                               |
| setFilters       | `(filters: Filter<DataType>[]) => void`                     | globally set the filtersState                                                                                                                                                    |
| objectPaths      | `ObjectPath<DataType>[]`                                    | all possible paths of the DataType as an object { key, label } where label is the translated value defined in keyLabels.. if no specific value defined it is the same as the key |

updateFilter: (name: string, update: Partial<Filter<DataType>>) => void;
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
