import { useMemo } from 'react';

const useDataCopy = <DataType>(initialData: DataType[]) => {
  const data = useMemo(() => [...initialData], [JSON.stringify(initialData)]);
  return { data };
};

export default useDataCopy;
