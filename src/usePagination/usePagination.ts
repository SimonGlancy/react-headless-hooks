import { useMemo } from 'react';
import useStepper from '../useStepper';
import { UsePaginationProps, UsePaginationReturn } from './usePagination.types';
import { paginateData } from './utils';

const usePagination = <DataType>(
  props: UsePaginationProps<DataType>
): UsePaginationReturn<DataType> => {
  const { data, pageSize = 1, initialPage } = props;

  const pages = useMemo(() => {
    return paginateData(data, pageSize);
  }, [data, pageSize]);

  const totalPages = useMemo(() => Object.keys(pages).length, [data]);

  const { step: currentPage, ...rest } = useStepper({
    steps: totalPages,
    initialStep: initialPage,
  });

  const currentPageData = useMemo(() => pages[currentPage], [pages, currentPage]);

  return { currentPage, totalPages, pages, currentPageData, ...rest };
};

export default usePagination;
