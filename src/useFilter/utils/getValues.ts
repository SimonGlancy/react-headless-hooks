import _ from 'lodash';
import { Paths } from '../../types';

export const getValue = <DataType>(item: DataType, key: Paths<DataType>) =>
  _.get(item, key);

const getValues = <DataType>(item: DataType, keys: Paths<DataType>[]) =>
  keys.map((key) => getValue(item, key));

export default getValues;
