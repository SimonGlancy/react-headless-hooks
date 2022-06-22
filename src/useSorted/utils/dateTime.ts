import compareBasic from './compareBasic';

const dateTime = (a: string, b: string) => {
  const aDate = new Date(a);
  const bDate = new Date(b);
  const aTime = aDate.getTime();
  const bTime = bDate.getTime();

  return compareBasic(aTime, bTime);
};

export default dateTime;
