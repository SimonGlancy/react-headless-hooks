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
import { useSelected, SelectTypeEnum } from 'ract-headless-hooks'

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

If you want to retrieve the selectedData programmatically say on a the hook returns a function selectData which returns the data in the same format as selectedData.

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
