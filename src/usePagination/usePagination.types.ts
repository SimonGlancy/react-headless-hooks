import { UseStepperReturn } from '../useStepper';

export type UsePaginationProps<DataType> = {
  data: DataType[];
  initialPage?: number;
  pageSize?: number;
};

export type UsePaginationReturn<DataType> = Omit<UseStepperReturn, 'step'> & {
  currentPage: number;
  currentPageData: DataType[];
  pages: Record<string, DataType[]>;
  totalPages: number;
};
