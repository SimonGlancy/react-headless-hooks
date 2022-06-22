import compareBasic from './compareBasic';

const numeric = (a: string, b: string) => {
  const aNum = Number(a);
  const bNum = Number(b);

  return compareBasic(aNum, bNum);
};

export default numeric;
