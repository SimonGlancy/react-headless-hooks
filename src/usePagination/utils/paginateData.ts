export const paginateData = <DataType>(items: DataType[], pageSize: number) => {
  const result = items.reduce((acc, curr) => {
    const numberOfPages = Object.keys(acc).length;
    //make it one indexed
    const currentPageNumber = numberOfPages === 0 ? 1 : numberOfPages;
    const existingValues = acc[currentPageNumber] || [];

    const nextPageNumber =
      existingValues.length < pageSize ? currentPageNumber : currentPageNumber + 1;

    return {
      ...acc,
      [nextPageNumber]: nextPageNumber !== currentPageNumber ? [curr] : [...existingValues, curr],
    };
  }, {} as Record<string, DataType[]>);
  return result;
};

export default paginateData;
