import _ from 'lodash';
import { useMemo } from 'react';
import { GenericObject, Paths } from '../types';
import { getObjectPaths, getValue } from '../useFilter/utils';
import { KeyLabels } from '../useSorted/useSorted.types';

export type ObjectPath<DataType> = {
  key: Paths<DataType>;
  label?: string;
};

export type UseObjectPaths<DataType extends GenericObject> = {
  key: Paths<DataType>;
  label: string;
}[];

const getLabel = <DataType extends GenericObject>(
  key: Paths<DataType>,
  keyLabels?: KeyLabels<DataType>
) => _.get(keyLabels, key) || key;

const useObjectPaths = <DataType extends GenericObject>(
  data: DataType[],
  keyLabels?: KeyLabels<DataType>
): ObjectPath<DataType>[] => {
  const objectPaths = useMemo(() => {
    const firstItem = data[0];
    const paths = getObjectPaths(firstItem) as Paths<DataType>[];
    return paths.map((key) => ({
      key,
      label: getLabel(key as Paths<DataType>, keyLabels),
    }));
  }, [data]);

  return objectPaths;
};

export default useObjectPaths;
