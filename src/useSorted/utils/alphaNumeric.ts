import toString from './toString';

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'variant',
  caseFirst: 'upper',
});

const alphaNumeric = (a: string, b: string) => {
  const aString = toString(a);
  const bString = toString(b);

  return collator.compare(aString, bString);
};

export default alphaNumeric;
