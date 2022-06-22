const coerceValueToNumber = (value: string | number) => {
  const valueAsNumber = Number(value);
  return Number.isNaN(valueAsNumber) ? 0 : valueAsNumber;
};

export default coerceValueToNumber;
