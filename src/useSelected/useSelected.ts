import { useCallback, useEffect, useMemo, useState } from 'react';
import { GenericObject } from '../types';
import useDataCopy from '../useDataCopy';
import useObjectPaths from '../useObjectPaths';
import usePrevious from '../usePrevious/usePrevious';
import {
  SelectedObject,
  SelectFunction,
  SelectTypeEnum,
  UpdateFunction,
  UseSelectedProps,
  UseSelectedReturnValues,
} from './useSelected.types';
import { getNewSelectedIndexes, normaliseData } from './utils';

const useSelected = <DataType extends GenericObject>(
  props: UseSelectedProps<DataType>
): UseSelectedReturnValues<DataType> => {
  const {
    data: initialdata,
    selectType,
    getItemId,
    withAutoSelect = true,
    initialSelected = {},
  } = props;
  const { data } = useDataCopy(initialdata);

  const previousData = usePrevious(data);
  const [selected, setSelected] = useState<SelectedObject>(initialSelected);

  const selectCount = useMemo(
    () => Object.values(selected).filter((i) => i).length,
    [selected]
  );
  const dataTotal = useMemo(() => data.length, [data]);
  const allSelected = useMemo(
    () => selectCount === dataTotal,
    [selectCount, dataTotal]
  );

  const memoisedGetItemId = useMemo(() => getItemId, [getItemId]);

  //this workflow allows the selected object to be remembered when only the index is being used
  // i.e when data is sorted the index value is no longer correct
  useEffect(() => {
    if (
      !!previousData &&
      previousData !== data &&
      selectType === SelectTypeEnum.BY_INDEX
    ) {
      // use the current selected object to get the object from the previous data
      const newSelected = getNewSelectedIndexes(previousData, data, selected);

      setSelected(newSelected);
    }
  }, [JSON.stringify(data)]);

  // Could I curry this to get cleaner implementation in select and deselect
  const updateValue: UpdateFunction<DataType> = useCallback(
    (item, index, value) => {
      switch (selectType) {
        case SelectTypeEnum.BY_ID: {
          const id = memoisedGetItemId(item);
          return setSelected((prev) => ({ ...prev, [id]: value }));
        }
        case SelectTypeEnum.BY_INDEX: {
          return setSelected((prev) => ({ ...prev, [index]: value }));
        }
      }
    },
    [selectType, memoisedGetItemId]
  );

  const select: SelectFunction<DataType> = useCallback(
    (item, index) => {
      updateValue(item, index, true);
    },
    [updateValue]
  );

  const deselect: SelectFunction<DataType> = useCallback(
    (item, index) => {
      updateValue(item, index, false);
    },
    [updateValue]
  );

  const getIsSelected = useCallback(
    (item: DataType, index: number) => {
      switch (selectType) {
        case SelectTypeEnum.BY_ID: {
          const id = memoisedGetItemId(item);
          return selected[id];
        }
        case SelectTypeEnum.BY_INDEX: {
          return selected[index];
        }
      }
    },
    [selected, selectType]
  );

  const toggle: SelectFunction<DataType> = useCallback(
    (item, index) => {
      getIsSelected(item, index) ? deselect(item, index) : select(item, index);
    },
    [select, getIsSelected, deselect]
  );

  const clear = useCallback(() => {
    setSelected({});
  }, []);

  const selectAll = useCallback(() => {
    const normalisedData = normaliseData(
      data,
      memoisedGetItemId,
      selectType,
      true
    );
    setSelected(normalisedData);
  }, [data, memoisedGetItemId]);

  const toggleSelectAll = useCallback(() => {
    allSelected ? clear() : selectAll();
  }, [allSelected, selectAll, clear]);

  const getNormalisedData = useCallback(
    () =>
      normaliseData(data, memoisedGetItemId, selectType, 'item') as Record<
        string,
        DataType
      >,
    [data, selectType, memoisedGetItemId]
  );

  const selectData = useCallback(() => {
    const normalisedData = getNormalisedData();

    return Object.entries(selected).reduce<DataType[]>(
      (dataArray, [key, value]) => {
        if (value) {
          return [...dataArray, normalisedData[key]];
        }
        return dataArray;
      },
      []
    );
  }, [selected, data, memoisedGetItemId]);

  const selectedData = useMemo(() => {
    if (withAutoSelect) {
      return selectData();
    }
    return undefined;
  }, [selected, data, memoisedGetItemId]);

  const objectPaths = useObjectPaths(data);

  return {
    select,
    deselect,
    selected,
    getIsSelected,
    toggle,
    selectedData,
    selectData,
    clear,
    selectAll,
    selectCount,
    dataTotal,
    allSelected,
    toggleSelectAll,
    getNormalisedData,
    objectPaths,
  };
};

export default useSelected;
